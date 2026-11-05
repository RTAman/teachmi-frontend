import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import bubbleSad from '../../assets/characters/bubble-sad.png';
import aiConfused from '../../assets/icons/ai-confused.svg';
import aiCurious from '../../assets/icons/ai-curious.svg';
import aiThinking from '../../assets/icons/ai-thinking.svg';
import arrowIcon from '../../assets/icons/arrow-right.svg';
import dontKnowIcon from '../../assets/icons/dont-know.svg';
import exampleIcon from '../../assets/icons/example.svg';
import hintIcon from '../../assets/icons/hint.svg';
import sendIcon from '../../assets/icons/send.svg';
import AiMessage from '../../components/AiMessage/AiMessage';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import Dialog from '../../components/Dialog/Dialog';
import StepBar from '../../components/StepBar/StepBar';
import {
  AI_REPLIES,
  CHAT_NOTICE,
  DONT_KNOW_REPLY,
  EXAMPLE_REPLY,
  FALLBACK_REPLY,
  FIRST_MESSAGES,
  HINT_REPLY,
  WRAP_UP_QUESTION,
  WRAP_UP_REPLY,
} from './chatSamples';
import { SAMPLE_SESSION } from './learnSamples';
import styles from './ChatPage.module.css';

const FACES = {
  curious: aiCurious,
  confused: aiConfused,
  thinking: aiThinking,
  'got-it': aiCurious,
};

const REPLY_DELAY = 1200;

let messageCount = 0;
function withId(message) {
  messageCount += 1;
  return { ...message, id: `msg-${messageCount}` };
}

function ChatAiMessage({ message }) {
  return (
    <AiMessage as="li" avatar={FACES[message.face]} label={message.label} typing={message.typing}>
      {message.text}
    </AiMessage>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const modeLabel = state?.mode === 'first' ? '처음 학습' : '복습';
  const [messages, setMessages] = useState(FIRST_MESSAGES);
  const [pending, setPending] = useState(null);
  const [replyIndex, setReplyIndex] = useState(0);
  const [phase, setPhase] = useState('explain');
  const [finalExplanation, setFinalExplanation] = useState('');
  const [draft, setDraft] = useState('');
  const [leaveOpen, setLeaveOpen] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, pending]);

  useEffect(() => {
    if (!pending) return undefined;
    const timer = setTimeout(() => {
      setMessages((list) => [...list, withId({ from: 'ai', ...pending })]);
      setPending(null);
    }, REPLY_DELAY);
    return () => clearTimeout(timer);
  }, [pending]);

  const busy = Boolean(pending);
  const canSend = draft.trim().length > 0 && !busy;

  function addMine(text) {
    setMessages((list) => [...list, withId({ from: 'me', text })]);
  }

  function nextReply() {
    if (phase === 'wrapup') return WRAP_UP_REPLY;
    const reply = AI_REPLIES[replyIndex] ?? FALLBACK_REPLY;
    setReplyIndex((index) => index + 1);
    return reply;
  }

  function handleSend(event) {
    event.preventDefault();
    if (!canSend) return;
    const text = draft.trim();
    addMine(text);
    setDraft('');
    setPending(nextReply());
    if (phase === 'wrapup') {
      setFinalExplanation(text);
      setPhase('done');
    }
  }

  function handleDontKnow() {
    if (busy) return;
    addMine('잘 모르겠어');
    setPending(DONT_KNOW_REPLY);
  }

  function handleFinish() {
    if (busy || phase !== 'explain') return;
    setPhase('wrapup');
    setPending(WRAP_UP_QUESTION);
    inputRef.current?.focus();
  }

  const finished = phase === 'done' && !busy;

  const footer = finished ? (
    <BottomCTA>
      <Button onClick={() => navigate('/learn/problem', { state: { ...state, finalExplanation } })}>
        응용문제 풀러 가기
      </Button>
    </BottomCTA>
  ) : (
    <div className={styles.composer}>
      {phase === 'explain' && (
        <div className={styles.chips}>
          <button type="button" className={styles.chip} onClick={() => setPending(HINT_REPLY)} disabled={busy}>
            <img src={hintIcon} alt="" width="18" height="18" />
            힌트 보기
          </button>
          <button type="button" className={styles.chip} onClick={handleDontKnow} disabled={busy}>
            <img src={dontKnowIcon} alt="" width="18" height="18" />
            잘 모르겠어
          </button>
          <button type="button" className={styles.chip} onClick={() => setPending(EXAMPLE_REPLY)} disabled={busy}>
            <img src={exampleIcon} alt="" width="18" height="18" />
            쉬운 예시
          </button>
        </div>
      )}
      <form className={styles.sendRow} onSubmit={handleSend}>
        <textarea
          ref={inputRef}
          className={styles.input}
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={phase === 'wrapup' ? '핵심을 한두 문장으로 정리해 주세요' : 'AI 학생에게 설명해 주세요'}
          aria-label="AI 학생에게 보낼 설명"
          maxLength={1000}
        />
        <button type="submit" className={styles.send} disabled={!canSend} aria-label="설명 보내기">
          {canSend ? (
            <img className={styles.sendArrow} src={arrowIcon} alt="" width="22" height="22" />
          ) : (
            <img src={sendIcon} alt="" width="48" height="48" />
          )}
        </button>
      </form>
    </div>
  );

  return (
    <AppShell
      header={
        <div className={styles.top}>
          <StepBar current={3} label="개념 설명" thin />
          <AppBar
            title={SAMPLE_SESSION.title}
            subtitle={`${SAMPLE_SESSION.subject} · ${modeLabel} · 03 개념 설명`}
            onBack={() => setLeaveOpen(true)}
            actionLabel={phase === 'explain' ? '설명 마치기' : undefined}
            onAction={handleFinish}
          />
        </div>
      }
      footer={footer}
    >
      <div className={styles.chat}>
        <p className={styles.notice}>{CHAT_NOTICE}</p>
        <ol className={styles.messages} aria-live="polite" aria-label="AI 학생과의 대화">
          {messages.map((message) =>
            message.from === 'ai' ? (
              <ChatAiMessage key={message.id} message={message} />
            ) : (
              <li key={message.id} className={styles.me}>
                <span className={styles.hidden}>나: </span>
                {message.text}
              </li>
            ),
          )}
          {busy && <ChatAiMessage message={{ face: 'thinking', typing: true }} />}
        </ol>
        <div ref={endRef} />
      </div>

      <Dialog
        open={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        character={<img src={bubbleSad} alt="" width="56" height="56" />}
        title="학습을 그만할까요?"
        actions={
          <>
            <Button size="md" variant="secondary" onClick={() => navigate('/home')}>
              학습 종료
            </Button>
            <Button size="md" onClick={() => setLeaveOpen(false)}>
              계속 설명하기
            </Button>
          </>
        }
      >
        지금까지 나눈 대화는 저장돼요.
        <br />
        홈에서 이어서 할 수 있어요.
      </Dialog>
    </AppShell>
  );
}
