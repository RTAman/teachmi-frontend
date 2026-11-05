import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import bookIcon from '../../assets/icons/book.svg';
import chatIcon from '../../assets/icons/chat.svg';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import StepBar from '../../components/StepBar/StepBar';
import Tag from '../../components/Tag/Tag';
import { SAMPLE_SESSION } from './learnSamples';
import styles from './ModePage.module.css';

const MODES = [
  {
    id: 'first',
    icon: bookIcon,
    title: '처음 학습해요',
    description: '핵심 요약과 쉬운 예시를 먼저 보고 AI 학생에게 설명해요',
    flow: ['요약 보기', '설명하기'],
    start: '처음 학습 시작하기',
    next: '/learn/summary',
  },
  {
    id: 'review',
    icon: chatIcon,
    title: '복습해요',
    description: '요약 없이 바로 AI 학생의 질문에 답하며 설명해요',
    flow: ['바로 설명하기'],
    start: '복습 시작하기',
    next: '/learn/chat',
  },
];

export default function ModePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const conceptName = state?.concept?.name ?? SAMPLE_SESSION.conceptName;
  const [modeId, setModeId] = useState(null);
  const mode = MODES.find((item) => item.id === modeId);

  return (
    <AppShell
      fill
      header={
        <>
          <AppBar title="학습 방식 선택" onBack={() => navigate('/learn')} />
          <StepBar current={2} label="시작 방식" />
        </>
      }
      footer={
        <BottomCTA>
          <Button disabled={!mode} onClick={() => navigate(mode.next, { state: { concept: state?.concept, mode: mode.id } })}>
            {mode ? mode.start : '학습 시작하기'}
          </Button>
        </BottomCTA>
      }
    >
      <div className={styles.page}>
        <div className={styles.concept}>
          <div className={styles.conceptText}>
            <p className={styles.conceptLabel}>선택한 개념</p>
            <p className={styles.conceptName}>
              {state?.subject ?? SAMPLE_SESSION.subject} · {conceptName}
            </p>
          </div>
          <button type="button" className={styles.change} onClick={() => navigate('/learn')}>
            변경
          </button>
        </div>

        <h2 id="mode-heading" className={styles.heading}>
          이 개념, 얼마나 알고 있나요?
        </h2>
        <div className={styles.options} role="radiogroup" aria-labelledby="mode-heading">
          {MODES.map((item) => {
            const selected = item.id === modeId;
            return (
              <label key={item.id} className={`${styles.option} ${selected ? styles.optionOn : ''}`}>
                <input
                  type="radio"
                  name="mode"
                  value={item.id}
                  checked={selected}
                  onChange={() => setModeId(item.id)}
                  className={styles.radio}
                />
                <img src={item.icon} alt="" width="48" height="48" />
                <span className={styles.title}>{item.title}</span>
                <span className={styles.description}>{item.description}</span>
                <span className={styles.flow}>
                  {item.flow.map((step, index) => (
                    <span key={step} className={styles.flowStep}>
                      {index > 0 && (
                        <span className={styles.arrow} aria-hidden="true">
                          →
                        </span>
                      )}
                      <Tag tone="neutral">{step}</Tag>
                    </span>
                  ))}
                </span>
              </label>
            );
          })}
        </div>

        <p className={styles.note}>두 방식 모두 설명 → 응용문제 → 성장 리포트로 이어져요</p>
      </div>
    </AppShell>
  );
}
