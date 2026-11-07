import { useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { newKey } from '../../api/client';
import { messageFor } from '../../api/errors';
import { startChat } from '../../api/sessions';
import bubbleCurious from '../../assets/characters/bubble-curious.png';
import arrowIcon from '../../assets/icons/arrow-right.svg';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import InlineError from '../../components/InlineError/InlineError';
import StepBar from '../../components/StepBar/StepBar';
import SessionGate from '../../learning/SessionGate';
import useLearningSession, { STAGE_ROUTES } from '../../learning/useLearningSession';
import { SAMPLE_SESSION, SAMPLE_SUMMARY } from './learnSamples';
import styles from './SummaryPage.module.css';

function toView(session, subject) {
  const summary = session.summary ?? {};
  return {
    title: session.concept.name,
    source: subject ?? '',
    core: [{ text: summary.text ?? '' }],
    exampleTexts: summary.examples ?? [],
    terms: summary.keyTerms ?? [],
    question: summary.reflectionPrompt ?? '',
  };
}

function sampleView() {
  return {
    title: SAMPLE_SESSION.title,
    source: SAMPLE_SESSION.source,
    core: SAMPLE_SUMMARY.core,
    example: SAMPLE_SUMMARY.example,
    terms: SAMPLE_SUMMARY.terms,
    question: SAMPLE_SUMMARY.question,
  };
}

export default function SummaryPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { live, session, loadError, subject } = useLearningSession();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const keyRef = useRef(null);

  const header = (
    <>
      <AppBar title="사전 학습" onBack={() => navigate('/learn/mode', { state })} />
      <StepBar current={3} label="개념 정리" />
    </>
  );

  if (live && !session) return <SessionGate loadError={loadError} header={header} />;
  if (live && session.stage !== 'summary') {
    return <Navigate to={STAGE_ROUTES[session.stage] ?? '/learn'} replace state={{ session, subject }} />;
  }

  const view = live ? toView(session, subject) : sampleView();

  async function handleStart() {
    if (!live) {
      navigate('/learn/chat', { state });
      return;
    }
    setError('');
    setStarting(true);
    if (!keyRef.current) keyRef.current = newKey();
    try {
      const next = await startChat(session.sessionId, session.version, keyRef.current);
      keyRef.current = null;
      navigate('/learn/chat', { state: { session: next, subject } });
    } catch (err) {
      if (err.status !== 0) keyRef.current = null;
      const current = err.body?.currentSession;
      if (current && current.stage === 'chat') {
        navigate('/learn/chat', { state: { session: current, subject } });
        return;
      }
      setStarting(false);
      setError(messageFor(err, '설명을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.'));
    }
  }

  return (
    <AppShell
      header={header}
      footer={
        <BottomCTA>
          <Button onClick={handleStart} disabled={starting}>
            {starting ? '첫 질문을 만들고 있어요...' : 'AI 학생에게 설명하러 가기'}
            {!starting && <img src={arrowIcon} alt="" width="18" height="18" />}
          </Button>
        </BottomCTA>
      }
    >
      <div className={styles.page}>
        <div>
          <p className={styles.eyebrow}>오늘의 개념</p>
          <h2 className={styles.title}>{view.title}</h2>
          {view.source && <p className={styles.source}>{view.source}</p>}
        </div>

        <section className={`${styles.card} ${styles.coreCard}`} aria-labelledby="core-title">
          <h3 id="core-title" className={styles.cardTitle}>
            핵심 개념
          </h3>
          <p className={styles.core}>
            {view.core.map((part) => (part.strong ? <strong key={part.text}>{part.text}</strong> : part.text))}
          </p>
        </section>

        {(view.example || view.exampleTexts?.length > 0) && (
          <section className={styles.card} aria-labelledby="example-title">
            <h3 id="example-title" className={styles.cardTitle}>
              이렇게 생각해 보세요
            </h3>
            {view.example ? (
              <>
                <p className={styles.example}>{view.example.text}</p>
                <div className={styles.split}>
                  <p className={styles.total}>
                    취득원가 <span>{view.example.total}</span>
                  </p>
                  <ul className={styles.years}>
                    {view.example.years.map((year) => (
                      <li key={year.label}>
                        <span className={styles.yearLabel}>{year.label}</span>
                        <span className={styles.yearAmount}>{year.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              view.exampleTexts.map((text) => (
                <p key={text} className={styles.example}>
                  {text}
                </p>
              ))
            )}
          </section>
        )}

        {view.terms.length > 0 && (
          <section className={styles.card} aria-labelledby="terms-title">
            <h3 id="terms-title" className={styles.cardTitle}>
              핵심 용어
            </h3>
            <ul className={styles.terms}>
              {view.terms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </section>
        )}

        {view.question && (
          <section className={styles.think} aria-labelledby="think-title">
            <img src={bubbleCurious} alt="" width="32" height="32" />
            <div>
              <h3 id="think-title" className={styles.thinkTitle}>
                생각해 볼 점
              </h3>
              <p className={styles.thinkText}>{view.question}</p>
            </div>
          </section>
        )}

        {error && <InlineError>{error}</InlineError>}
      </div>
    </AppShell>
  );
}
