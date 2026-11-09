import { Navigate, useNavigate } from 'react-router';
import arrowIcon from '../../assets/icons/arrow-right.svg';
import infoIcon from '../../assets/icons/info.svg';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import InlineError from '../../components/InlineError/InlineError';
import StepBar from '../../components/StepBar/StepBar';
import Tag from '../../components/Tag/Tag';
import { useLiveReport, useReportActions } from '../../learning/useLiveReport';
import { ReportLoading } from './LiveReport';
import styles from './ReportDetailPage.module.css';

const OUTCOMES = {
  FIRST_TRY_CORRECT: { tag: '정답', tone: 'ok' },
  CORRECT_AFTER_RETEACH: { tag: '정답 · 재설명 후', tone: 'ok' },
  CORRECT_AFTER_SOLUTION: { tag: '해설 후 정답', tone: 'neutral' },
  WRONG: { tag: '오답', tone: 'bad' },
  PENDING_REVIEW: { tag: '판정 보류', tone: 'neutral' },
  UNFINISHED: { tag: '미완료', tone: 'neutral' },
};

export default function LiveReportDetail() {
  const navigate = useNavigate();
  const { sessionId, report, error, noSession, state } = useLiveReport();
  const actions = useReportActions(sessionId, report);

  const header = (
    <>
      <AppBar title="학습 내용 자세히" onBack={() => navigate('/learn/report', { state: { ...state, sessionId, report } })} />
      <StepBar current={5} label="성장 확인" />
    </>
  );

  if (noSession) return <Navigate to="/home" replace />;
  if (!report) return <ReportLoading header={header} error={error} />;

  const { explanation, application, nextSteps } = report;
  const delivered = explanation.deliveredSupport;
  const independent = explanation.result === 'independent';
  const allSolved = application.independentCorrect === application.total;
  const areas = [
    {
      title: '개념 설명',
      tag: independent ? '혼자 설명' : '도움 받아 설명',
      tone: independent ? 'ok' : 'ai',
      text: independent ? '힌트 없이 끝까지 설명했어요' : `도움을 ${delivered.total}번 받고 설명했어요`,
    },
    {
      title: '독립 적용',
      tag: `${application.total}문제 중 ${application.independentCorrect}개`,
      tone: allSolved ? 'ok' : 'warn',
      text: '힌트 없이 첫 시도에 맞혔어요',
    },
  ];

  return (
    <AppShell
      header={header}
      footer={
        <BottomCTA>
          <Button variant="secondary" onClick={actions.goHome} disabled={actions.busy}>
            홈으로
          </Button>
          <Button onClick={() => actions.explainAgain()} disabled={actions.busy}>
            한 번 더 설명하기
          </Button>
        </BottomCTA>
      }
    >
      <div className={styles.page}>
        <section aria-labelledby="change-title">
          <h2 id="change-title" className={styles.title}>
            설명의 변화
          </h2>
          {explanation.initialAnswer && (
            <div className={styles.first}>
              <p className={styles.label}>학습 초기 · 첫 답변</p>
              <p className={styles.quote}>“{explanation.initialAnswer.text}”</p>
            </div>
          )}
          <p className={styles.cap}>
            <img src={arrowIcon} alt="" width="18" height="18" />
            힌트 {delivered.hint}회 · 쉬운 예시 {delivered.example}회
          </p>
          {explanation.finalExplanation && (
            <div className={styles.final}>
              <p className={`${styles.label} ${styles.finalLabel}`}>학습 후 · 최종 설명</p>
              <p className={styles.finalQuote}>“{explanation.finalExplanation.text}”</p>
            </div>
          )}
        </section>

        <section aria-labelledby="area-title">
          <h2 id="area-title" className={styles.title}>
            확인 영역
          </h2>
          <ul className={styles.areas}>
            {areas.map((area) => (
              <li key={area.title}>
                <h3>{area.title}</h3>
                <Tag tone={area.tone}>{area.tag}</Tag>
                <p>{area.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="problem-title">
          <h2 id="problem-title" className={styles.title}>
            응용문제 결과
          </h2>
          <ul className={styles.problems}>
            {application.problems.map((problem) => {
              const outcome = OUTCOMES[problem.outcome] ?? OUTCOMES.UNFINISHED;
              return (
                <li key={problem.problemId}>
                  <div className={styles.problemTop}>
                    <h3>문제 {problem.sequence}</h3>
                    <Tag tone={outcome.tone}>{outcome.tag}</Tag>
                  </div>
                  <p>{problem.question}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {nextSteps.length > 0 && (
          <section aria-labelledby="improve-title">
            <h2 id="improve-title" className={styles.title}>
              보완할 내용
            </h2>
            <div className={styles.box}>
              <ol className={styles.improve}>
                {nextSteps.map((step, index) => (
                  <li key={step.problemId}>
                    <span className={index === 0 ? styles.numWarn : styles.num}>{index + 1}</span>
                    <span>
                      <strong>{step.focus}</strong>
                    </span>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className={styles.again}
                onClick={() => actions.explainAgain(nextSteps[0].problemId)}
                disabled={actions.busy}
              >
                이 부분 다시 설명하기
              </button>
            </div>
          </section>
        )}

        {actions.error && <InlineError>{actions.error}</InlineError>}

        <p className={styles.note}>
          <img src={infoIcon} alt="" width="18" height="18" />
          힌트를 받은 설명과 혼자 푼 문제 결과를 나눠서 보여 줘요. 대화 길이나 답변 길이는 결과에 반영하지 않아요.
        </p>
      </div>
    </AppShell>
  );
}
