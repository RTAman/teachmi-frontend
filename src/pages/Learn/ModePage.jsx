import { useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { newKey } from '../../api/client';
import { isTerminal } from '../../api/errors';
import { chooseMode } from '../../api/sessions';
import bookIcon from '../../assets/icons/book.svg';
import chatIcon from '../../assets/icons/chat.svg';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import InlineError from '../../components/InlineError/InlineError';
import StepBar from '../../components/StepBar/StepBar';
import Tag from '../../components/Tag/Tag';
import SessionGate from '../../learning/SessionGate';
import { generationRecovery } from '../../learning/generationRecovery';
import useLearningSession, { STAGE_ROUTES } from '../../learning/useLearningSession';
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
    loading: '요약을 만들고 있어요...',
    next: '/learn/summary',
  },
  {
    id: 'review',
    icon: chatIcon,
    title: '복습해요',
    description: '요약 없이 바로 AI 학생의 질문에 답하며 설명해요',
    flow: ['바로 설명하기'],
    start: '복습 시작하기',
    loading: '첫 질문을 만들고 있어요...',
    next: '/learn/chat',
  },
];

export default function ModePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { live, session, setSession, loadError, checking, refresh, subject } = useLearningSession({ verifyOnMount: true });
  const [modeId, setModeId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const keyRef = useRef(null);
  const inFlight = useRef(false);
  const mode = MODES.find((item) => item.id === modeId);
  const recovery = generationRecovery(session, error);
  const locked = submitting || refreshing || recovery.blocked;

  const header = (
    <>
      <AppBar title="학습 방식 선택" onBack={() => navigate('/learn')} />
      <StepBar current={2} label="시작 방식" />
    </>
  );

  if (live && (checking || loadError || !session)) return <SessionGate loadError={loadError} header={header} />;
  if (live && session.stage !== 'mode') {
    return <Navigate to={STAGE_ROUTES[session.stage] ?? '/learn'} replace state={{ session, subject }} />;
  }

  const conceptName = live ? session.concept.name : (state?.concept?.name ?? SAMPLE_SESSION.conceptName);
  const subjectName = live ? subject : (state?.subject ?? SAMPLE_SESSION.subject);

  async function handleStart() {
    if (!mode || locked || inFlight.current) return;
    if (!live) {
      navigate(mode.next, { state: { concept: state?.concept, mode: mode.id } });
      return;
    }
    inFlight.current = true;
    setError(null);
    setSubmitting(true);
    if (!keyRef.current) keyRef.current = newKey();
    try {
      const next = await chooseMode(session.sessionId, mode.id, session.version, keyRef.current);
      keyRef.current = null;
      navigate(STAGE_ROUTES[next.stage] ?? mode.next, { state: { session: next, subject } });
    } catch (err) {
      const current = err.body?.currentSession;
      if (current) setSession(current);
      if (current && current.stage !== 'mode') {
        navigate(STAGE_ROUTES[current.stage] ?? '/learn', { state: { session: current, subject } });
        return;
      }
      setError(err);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  async function handleRefresh() {
    if (refreshing || inFlight.current) return;
    setRefreshing(true);
    try { await refresh(); if (!isTerminal(error)) setError(null); }
    catch (err) { if (!isTerminal(error)) setError(err); }
    finally { setRefreshing(false); }
  }

  function handleChange() {
    navigate('/learn', live ? { state: { materialId: session.materialId } } : undefined);
  }

  return (
    <AppShell
      fill
      header={header}
      footer={
        <BottomCTA>
          <Button disabled={!mode || locked} onClick={handleStart}>
            {mode ? (submitting ? mode.loading : mode.start) : '학습 시작하기'}
          </Button>
        </BottomCTA>
      }
    >
      <div className={styles.page}>
        <div className={styles.concept}>
          <div className={styles.conceptText}>
            <p className={styles.conceptLabel}>선택한 개념</p>
            <p className={styles.conceptName}>{subjectName ? `${subjectName} · ${conceptName}` : conceptName}</p>
          </div>
          <button type="button" className={styles.change} onClick={handleChange} disabled={locked}>
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
                  disabled={locked}
                  onChange={() => { keyRef.current = null; setModeId(item.id); }}
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

        {recovery.message && <InlineError>{recovery.message}</InlineError>}
        {recovery.blocked && <Button variant="secondary" disabled={refreshing} onClick={handleRefresh}>
          {refreshing ? '저장 상태를 확인하고 있어요...' : '저장 상태 확인'}
        </Button>}
        <p className={styles.note}>두 방식 모두 설명 → 응용문제 → 성장 리포트로 이어져요</p>
      </div>
    </AppShell>
  );
}
