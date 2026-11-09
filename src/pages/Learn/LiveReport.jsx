import { Navigate, useNavigate } from 'react-router';
import { messageFor } from '../../api/errors';
import bubbleGotIt from '../../assets/characters/bubble-got-it.png';
import chevronIcon from '../../assets/icons/chevron-right.svg';
import hintBadge from '../../assets/icons/hint-badge.svg';
import stuckBadge from '../../assets/icons/stuck-badge.svg';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import InlineError from '../../components/InlineError/InlineError';
import Skeleton from '../../components/Skeleton/Skeleton';
import StepBar from '../../components/StepBar/StepBar';
import { useLiveReport, useReportActions } from '../../learning/useLiveReport';
import styles from './ReportPage.module.css';

function PlainStat({ icon, title, count }) {
  return (
    <section className={`${styles.stat} ${styles.statPlain}`}>
      <h3 className={styles.statTitle}>
        <img src={icon} alt="" width="32" height="32" />
        {title}
      </h3>
      <p className={styles.statNumbers}>
        <strong>{count}</strong>
        <span className={styles.statUnit}>회</span>
      </p>
    </section>
  );
}

export function ReportLoading({ header, error }) {
  return (
    <AppShell header={header}>
      {error ? (
        <p className={styles.loadError} role="alert">
          {messageFor(error, '리포트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')}
        </p>
      ) : (
        <div className={styles.page} aria-label="리포트를 만드는 중">
          <Skeleton width="70%" height={24} radius={6} />
          <Skeleton height={148} radius={24} />
          <Skeleton height={120} radius={20} />
        </div>
      )}
    </AppShell>
  );
}

export default function LiveReport() {
  const navigate = useNavigate();
  const { sessionId, report, error, noSession, state } = useLiveReport();
  const actions = useReportActions(sessionId, report);

  const header = (
    <>
      <AppBar title="학습 결과" onClose={actions.goHome} />
      <StepBar current={5} label="성장 확인" />
    </>
  );

  if (noSession) return <Navigate to="/home" replace />;
  if (error?.code === 'ASSESSMENT_NOT_READY') return <Navigate to="/learn/problem" replace state={state} />;
  if (!report) return <ReportLoading header={header} error={error} />;

  const { application, explanation, concept } = report;
  const delivered = explanation.deliveredSupport;
  const solved = application.independentCorrect;

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
        <div>
          <h2 className={styles.heading}>이번 학습 결과예요</h2>
          <p className={styles.sub}>{concept.name}</p>
        </div>

        <section className={styles.highlight} aria-label="혼자 푼 문제">
          {solved > 0 && <img src={bubbleGotIt} alt="" width="76" height="76" />}
          <div>
            <p className={styles.highlightLabel}>도움 없이 혼자 푼 문제</p>
            <p className={styles.highlightNumbers}>
              <strong>{solved}</strong>
              <span className={styles.bigArrow} aria-hidden="true">
                /
              </span>
              <span className={styles.before}>{application.total}</span>
              <span className={styles.unit}>문제</span>
            </p>
          </div>
        </section>

        <div className={styles.stats}>
          <PlainStat icon={hintBadge} title="힌트·쉬운 예시" count={delivered.hint + delivered.example} />
          <PlainStat icon={stuckBadge} title="잘 모르겠어" count={delivered.dontKnow} />
        </div>

        <p className={styles.footnote}>· 점수·퍼센트·답변 길이는 쓰지 않아요</p>
        {actions.error && <InlineError>{actions.error}</InlineError>}

        <button
          type="button"
          className={styles.detail}
          onClick={() => navigate('/learn/report/detail', { state: { ...state, sessionId, report } })}
        >
          <span>
            <strong>학습 내용 자세히 보기</strong>
            <span>설명의 변화 · 확인 영역 · 문제 결과 · 보완할 내용</span>
          </span>
          <img src={chevronIcon} alt="" width="20" height="20" />
        </button>
      </div>
    </AppShell>
  );
}
