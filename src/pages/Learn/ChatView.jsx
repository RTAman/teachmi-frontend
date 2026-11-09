import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
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
import { CHAT_NOTICE } from './chatSamples';
import styles from './ChatPage.module.css';

const FACES = {
  curious: aiCurious,
  confused: aiConfused,
  thinking: aiThinking,
  'got-it': aiCurious,
};

const HELP_BUTTONS = [
  { kind: 'hint', label: '힌트 보기', icon: hintIcon },
  { kind: 'dont_know', label: '잘 모르겠어', icon: dontKnowIcon },
  { kind: 'example', label: '쉬운 예시', icon: exampleIcon },
];

function ChatAiMessage({ message }) {
  return (
    <AiMessage as="li" avatar={FACES[message.face] ?? aiCurious} label={message.label} typing={message.typing}>
      {message.text}
    </AiMessage>
  );
}

export default function ChatView({
  title,
  subtitle,
  messages,
  typing,
  showChips,
  showFinish,
  onFinish,
  onHelp,
  onSend,
  placeholder,
  done,
  onNext,
  nextLabel = '응용문제 풀러 가기',
  alert,
  locked = false,
}) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  const [leaveOpen, setLeaveOpen] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const canSend = draft.trim().length > 0 && !typing && !locked;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, typing, alert]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSend) return;
    onSend(draft.trim());
    setDraft('');
  }

  function handleFinish() {
    onFinish();
    inputRef.current?.focus();
  }

  const footer = done ? (
    <BottomCTA>
      <Button onClick={onNext}>{nextLabel}</Button>
    </BottomCTA>
  ) : (
    <div className={styles.composer}>
      {showChips && (
        <div className={styles.chips}>
          {HELP_BUTTONS.map((button) => (
            <button
              key={button.kind}
              type="button"
              className={styles.chip}
              onClick={() => onHelp(button.kind)}
              disabled={typing || locked}
            >
              <img src={button.icon} alt="" width="18" height="18" />
              {button.label}
            </button>
          ))}
        </div>
      )}
      <form className={styles.sendRow} onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className={styles.input}
          rows={1}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          aria-label="AI 학생에게 보낼 설명"
          maxLength={4000}
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
            title={title}
            subtitle={subtitle}
            onBack={() => setLeaveOpen(true)}
            actionLabel={showFinish ? '설명 마치기' : undefined}
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
          {typing && <ChatAiMessage message={{ face: 'thinking', typing: true }} />}
        </ol>
        {alert && (
          <div className={styles.alert} role="alert">
            <p>{alert.text}</p>
            {alert.actionLabel && (
              <button type="button" onClick={alert.onAction}>
                {alert.actionLabel}
              </button>
            )}
          </div>
        )}
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
