import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { newKey } from '../../api/client';
import { canRetrySame, isTerminal, messageFor, terminalMessage } from '../../api/errors';
import { finishExplanation, getSession, sendTurn } from '../../api/sessions';
import AppBar from '../../components/AppBar/AppBar';
import SessionGate from '../../learning/SessionGate';
import useHesitation from '../../learning/useHesitation';
import useLearningSession, { STAGE_ROUTES } from '../../learning/useLearningSession';
import ChatView from './ChatView';
import {
  AI_REPLIES,
  DONT_KNOW_REPLY,
  EXAMPLE_REPLY,
  FALLBACK_REPLY,
  FIRST_MESSAGES,
  HINT_REPLY,
  WRAP_UP_QUESTION,
  WRAP_UP_REPLY,
} from './chatSamples';
import { SAMPLE_SESSION } from './learnSamples';

const REPLY_DELAY = 1200;
const POLL_DELAY = 2000;
const MAX_POLLS = 30;
const DEFAULT_PLACEHOLDER = 'AI 학생에게 설명해 주세요';
const WRAP_UP_PLACEHOLDER = '핵심을 한두 문장으로 정리해 주세요';

const ASSISTANT_STYLE = {
  case_question: { face: 'curious', label: '궁금한 점이 있어요' },
  stage_question: { face: 'curious' },
  followup_question: { face: 'confused' },
  wrapup_question: { face: 'curious', label: '마지막 정리' },
  learning_complete: { face: 'got-it', label: '이해했어요' },
  reteach_question: { face: 'curious', label: '다시 설명해 줄래요?' },
  reteach_complete: { face: 'got-it', label: '이해했어요' },
  hint: { face: 'curious', label: '힌트' },
  example: { face: 'curious', label: '쉬운 예시' },
  dont_know: { face: 'curious', label: '같이 생각해 봐요' },
};

let demoCount = 0;
function withId(message) {
  demoCount += 1;
  return { ...message, id: `demo-${demoCount}` };
}

function DemoChat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const modeLabel = state?.mode === 'first' ? '처음 학습' : '복습';
  const [messages, setMessages] = useState(FIRST_MESSAGES);
  const [pending, setPending] = useState(null);
  const [replyIndex, setReplyIndex] = useState(0);
  const [phase, setPhase] = useState('explain');
  const [finalExplanation, setFinalExplanation] = useState('');

  useEffect(() => {
    if (!pending) return undefined;
    const timer = setTimeout(() => {
      setMessages((list) => [...list, withId({ from: 'ai', ...pending })]);
      setPending(null);
    }, REPLY_DELAY);
    return () => clearTimeout(timer);
  }, [pending]);

  const busy = Boolean(pending);

  function addMine(text) {
    setMessages((list) => [...list, withId({ from: 'me', text })]);
  }

  function handleSend(text) {
    addMine(text);
    if (phase === 'wrapup') {
      setPending(WRAP_UP_REPLY);
      setFinalExplanation(text);
      setPhase('done');
      return;
    }
    setPending(AI_REPLIES[replyIndex] ?? FALLBACK_REPLY);
    setReplyIndex((index) => index + 1);
  }

  function handleHelp(kind) {
    if (busy) return;
    if (kind === 'dont_know') {
      addMine('잘 모르겠어');
      setPending(DONT_KNOW_REPLY);
    } else {
      setPending(kind === 'hint' ? HINT_REPLY : EXAMPLE_REPLY);
    }
  }

  function handleFinish() {
    if (busy || phase !== 'explain') return;
    setPhase('wrapup');
    setPending(WRAP_UP_QUESTION);
  }

  return (
    <ChatView
      title={SAMPLE_SESSION.title}
      subtitle={`${SAMPLE_SESSION.subject} · ${modeLabel} · 03 개념 설명`}
      messages={messages}
      typing={busy}
      showChips={phase === 'explain'}
      showFinish={phase === 'explain'}
      onFinish={handleFinish}
      onHelp={handleHelp}
      onSend={handleSend}
      placeholder={phase === 'wrapup' ? WRAP_UP_PLACEHOLDER : DEFAULT_PLACEHOLDER}
      done={phase === 'done' && !busy}
      onNext={() => navigate('/learn/problem', { state: { ...state, finalExplanation } })}
    />
  );
}

function toMessages(session, sending) {
  const list = [...session.messages]
    .sort((a, b) => a.sequence - b.sequence)
    .flatMap((message) => {
      if (message.role === 'user') {
        if (message.kind === 'answer') return [{ id: message.messageId, from: 'me', text: message.text }];
        if (message.kind === 'dont_know') return [{ id: message.messageId, from: 'me', text: '잘 모르겠어' }];
        return [];
      }
      const style = ASSISTANT_STYLE[message.kind] ?? { face: 'curious' };
      return [{ id: message.messageId, from: 'ai', text: message.text, ...style }];
    });
  if (sending?.text) list.push({ id: 'sending', from: 'me', text: sending.text });
  return list;
}

function LiveChat({ initial, subject }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(initial);
  const [sending, setSending] = useState(null);
  const [alert, setAlert] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const lastRequestRef = useRef(null);
  const finishKeyRef = useRef(null);

  const pending = session.pendingTurn;
  const terminal = terminalMessage({ code: pending?.errorCode, recovery: session.recovery });
  const generating = pending?.state === 'generating' && !terminal;
  const failed = pending?.state === 'failed' || pending?.state === 'interrupted';
  const canRetryPending = failed && !terminal && session.availableActions?.includes('retry_turn');
  const waitOnly = !terminal && !generating && !failed && session.availableActions?.includes('wait');
  const done = session.stage !== 'chat' || session.availableActions?.includes('start_problems');
  const awaitingFinish = session.availableActions?.includes('finish_explanation');

  useEffect(() => {
    if (!generating || sending || timedOut) return undefined;
    let active = true;
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      if (count > MAX_POLLS) {
        clearInterval(timer);
        if (active) setTimedOut(true);
        return;
      }
      getSession(session.sessionId)
        .then((next) => active && setSession(next))
        .catch(() => {});
    }, POLL_DELAY);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [generating, sending, timedOut, session.sessionId]);

  async function submit(request) {
    lastRequestRef.current = request;
    setAlert(null);
    setSending({ kind: request.kind, text: request.kind === 'answer' ? request.text : request.kind === 'dont_know' ? '잘 모르겠어' : '' });
    try {
      const next = await sendTurn(session.sessionId, request, request.key);
      lastRequestRef.current = null;
      setSession(next);
    } catch (err) {
      const current = err.body?.currentSession;
      if (current) setSession(current);
      setAlert({
        text: messageFor(err, '보내지 못했어요.'),
        canRetry: canRetrySame(err) && !isTerminal(err),
        locked: isTerminal(err),
      });
    } finally {
      setSending(null);
    }
  }

  function retry() {
    if (canRetryPending) {
      const saved = session.messages.find((message) => message.messageId === pending.userMessageId);
      submit({
        kind: pending.kind,
        text: saved?.text,
        expectedVersion: pending.expectedVersion,
        key: pending.idempotencyKey,
      });
      return;
    }
    if (lastRequestRef.current) submit(lastRequestRef.current);
  }

  function checkStatus() {
    getSession(session.sessionId)
      .then(setSession)
      .catch((err) => setAlert({ text: messageFor(err, '상태를 확인하지 못했어요.') }));
  }

  function send(kind, text) {
    submit({ kind, text, expectedVersion: session.version, key: newKey() });
  }

  async function finish() {
    finishKeyRef.current ??= newKey();
    setAlert(null);
    setFinishing(true);
    try {
      const next = await finishExplanation(session.sessionId, session.version, finishKeyRef.current);
      navigate('/learn/problem', { state: { session: next, subject } });
    } catch (err) {
      const current = err.body?.currentSession;
      if (current) {
        setSession(current);
        finishKeyRef.current = null;
      }
      setAlert({ text: messageFor(err, '설명을 마치지 못했어요. 다시 눌러 주세요.') });
      setFinishing(false);
    }
  }

  function handleNext() {
    if (session.stage === 'report') {
      navigate('/learn/report', { state: { session, subject } });
      return;
    }
    navigate('/learn/problem', { state: { session, subject } });
  }

  let shownAlert = null;
  if (terminal) shownAlert = { text: terminal };
  else if (generating && timedOut) {
    shownAlert = { text: '처리가 지연되고 있어요. 저장된 내용을 확인해 주세요.', actionLabel: '상태 확인', onAction: checkStatus };
  } else if (canRetryPending) {
    shownAlert = { text: 'AI 학생이 답을 만들지 못했어요. 다시 보내 주세요.', actionLabel: '다시 보내기', onAction: retry };
  } else if (waitOnly) {
    shownAlert = { text: '진행 상태를 확인하고 있어요.', actionLabel: '상태 확인', onAction: checkStatus };
  } else if (alert) {
    shownAlert = { text: alert.text, actionLabel: alert.canRetry ? '다시 보내기' : undefined, onAction: retry };
  }

  const modeLabel = session.mode === 'first' ? '처음 학습' : '복습';
  const locked = Boolean(terminal) || Boolean(alert?.locked) || waitOnly;
  const returning = Boolean(session.problemReturn) || session.availableActions?.includes('retry_problem');
  const canAnswer = !done && !awaitingFinish && !generating && !failed && !locked && !sending;
  const lastMessage = session.messages.at(-1);
  const waitingOnQuestion = canAnswer && !drafting && lastMessage?.role === 'assistant' && lastMessage.kind.endsWith('_question');
  useHesitation(session.sessionId, waitingOnQuestion ? lastMessage.messageId : null);

  let nextLabel = '응용문제 풀러 가기';
  if (returning) nextLabel = '같은 문제 다시 풀기';
  if (awaitingFinish) nextLabel = '설명 마치기';

  return (
    <ChatView
      title={session.concept.name}
      subtitle={`${subject ? `${subject} · ` : ''}${modeLabel} · 03 개념 설명`}
      messages={toMessages(session, sending)}
      typing={Boolean(sending) || (generating && !timedOut)}
      showChips={!done && !awaitingFinish}
      showFinish={false}
      onFinish={() => {}}
      onHelp={(kind) => send(kind)}
      onSend={(text) => send('answer', text)}
      placeholder={session.chatStage === 'wrapup' ? WRAP_UP_PLACEHOLDER : DEFAULT_PLACEHOLDER}
      done={(done || awaitingFinish) && !sending}
      onNext={awaitingFinish ? finish : handleNext}
      nextLabel={nextLabel}
      nextDisabled={finishing}
      alert={shownAlert}
      locked={locked}
      onDraftingChange={setDrafting}
    />
  );
}

export default function ChatPage() {
  const { live, session, loadError, subject } = useLearningSession();

  if (!live) return <DemoChat />;
  if (!session) return <SessionGate loadError={loadError} header={<AppBar title="AI 학생 대화" />} />;
  if (session.stage === 'mode' || session.stage === 'summary') {
    return <Navigate to={STAGE_ROUTES[session.stage]} replace state={{ session, subject }} />;
  }
  return <LiveChat initial={session} subject={subject} />;
}
