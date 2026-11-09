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
import formatDate from '../../learning/formatDate';
import { useLiveReport, usePreviousReport, useReportActions } from '../../learning/useLiveReport';
import FlowChart from './FlowChart';
import ReportStat from './ReportStat';
import styles from './ReportPage.module.css';

const STAGE_TICKS = ['', '사례', '개념', '이유', '정리'];

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

function KeyPointsCard({ keyPoints, previousPoints }) {
  const before = previousPoints ? previousPoints.finalCount : keyPoints.initialCount;
  const after = keyPoints.finalCount;
  const gained = after - before;
  let delta = '이번에도 같은 만큼 설명했어요';
  if (gained > 0) delta = `+${gained}개 늘었어요`;
  if (gained < 0) delta = '다시 설명하며 채워 볼까요';

  return (
    <section className={styles.highlight} aria-label="혼자 말한 핵심 요소">
      {gained > 0 && <img src={bubbleGotIt} alt="" width="76" height="76" />}
      <div>
        <p className={styles.highlightLabel}>
          혼자 말한 핵심 요소{previousPoints ? '' : ' · 첫 설명 → 최종 설명'}
        </p>
        <p className={styles.highlightNumbers}>
          <span className={styles.before}>{before}</span>
          <span className={styles.bigArrow} aria-hidden="true">
            →
          </span>
          <strong>{after}</strong>
          <span className={styles.unit}>개</span>
        </p>
        <span className={styles.highlightDelta}>{delta}</span>
      </div>
    </section>
  );
}

function SolvedCard({ application }) {
  return (
    <section className={styles.highlight} aria-label="혼자 푼 문제">
      {application.independentCorrect > 0 && <img src={bubbleGotIt} alt="" width="76" height="76" />}
      <div>
        <p className={styles.highlightLabel}>도움 없이 혼자 푼 문제</p>
        <p className={styles.highlightNumbers}>
          <strong>{application.independentCorrect}</strong>
          <span className={styles.bigArrow} aria-hidden="true">
            /
          </span>
          <span className={styles.before}>{application.total}</span>
          <span className={styles.unit}>문제</span>
        </p>
      </div>
    </section>
  );
}

function FlowSection({ points }) {
  const helps = points.filter((point) => point.action === 'hint' || point.action === 'example').length;
  const stuck = points.filter(isStuck).length;
  const turns = points.map((point) => ({ count: point.stageLevel, event: eventOf(point) }));

  return (
    <section className={styles.flow}>
      <h3 className={styles.flowTitle}>대화 흐름</h3>
      <p className={styles.sub}>
        대화 {points.length}턴 동안 힌트·예시 {helps}번, 망설임 {stuck}번이 있었어요
      </p>
      <FlowChart
        turns={turns}
        max={STAGE_TICKS.length - 1}
        tickLabels={STAGE_TICKS}
        label={`대화 ${points.length}턴 동안 설명 단계가 어떻게 이어졌는지 보여 주는 그래프`}
      />
      <ul className={styles.legend}>
        <li>
          <span className={styles.legendRing} />
          설명 단계
        </li>
        <li>
          <img src={hintBadge} alt="" width="18" height="18" />
          힌트
        </li>
        <li>
          <img src={stuckBadge} alt="" width="18" height="18" />
          망설임
        </li>
      </ul>
    </section>
  );
}

function isStuck(point) {
  return point.action === 'dont_know' || point.hesitated;
}

function eventOf(point) {
  if (isStuck(point)) return 'stuck';
  return point.action === 'hint' || point.action === 'example' ? 'hint' : undefined;
}

export default function LiveReport() {
  const navigate = useNavigate();
  const { sessionId, report, error, noSession, state } = useLiveReport();
  const actions = useReportActions(sessionId, report);
  const { previous, waiting } = usePreviousReport(report?.comparison?.previousSessionId);

  const header = (
    <>
      <AppBar title="학습 결과" onClose={actions.goHome} />
      <StepBar current={5} label="성장 확인" />
    </>
  );

  if (noSession) return <Navigate to="/home" replace />;
  if (error?.code === 'ASSESSMENT_NOT_READY') return <Navigate to="/learn/problem" replace state={state} />;
  if (!report || waiting) return <ReportLoading header={header} error={error} />;

  const { application, explanation, concept, keyPoints, comparison, flow } = report;
  const delivered = explanation.deliveredSupport;
  const flowPoints = flow?.points ?? [];
  const hasFlow = flowPoints.length > 0;
  const countWaits = Boolean(previous?.flow && flow);
  const stuckBefore = comparison && comparison.hesitations.previous + (countWaits ? previous.flow.hesitationCount : 0);
  const stuckAfter = comparison && comparison.hesitations.current + (countWaits ? flow.hesitationCount : 0);
  const grew = Boolean(keyPoints || comparison);
  let compareText = '';
  if (comparison) compareText = `${formatDate(comparison.previousStudiedAt)} 학습과 비교했어요`;
  else if (hasFlow) compareText = '처음 배우는 개념이라 이번 대화의 흐름을 보여 줘요';

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
          <h2 className={styles.heading}>{grew ? '이번 학습에서 이만큼 성장했어요' : '이번 학습 결과예요'}</h2>
          <p className={styles.sub}>{concept.name}</p>
          {compareText && <p className={styles.sub}>{compareText}</p>}
        </div>

        {keyPoints ? (
          <KeyPointsCard keyPoints={keyPoints} previousPoints={previous?.keyPoints} />
        ) : (
          <SolvedCard application={application} />
        )}

        {comparison && (
          <div className={styles.stats}>
            <ReportStat
              icon={hintBadge}
              title="힌트 사용"
              before={comparison.hints.previous}
              after={comparison.hints.current}
            />
            <ReportStat icon={stuckBadge} title="망설인 답변" before={stuckBefore} after={stuckAfter} />
          </div>
        )}

        {!comparison && !hasFlow && (
          <div className={styles.stats}>
            <PlainStat icon={hintBadge} title="힌트·쉬운 예시" count={delivered.hint + delivered.example} />
            <PlainStat icon={stuckBadge} title="잘 모르겠어" count={delivered.dontKnow} />
          </div>
        )}

        {hasFlow && <FlowSection points={flowPoints} />}

        <p className={styles.footnote}>
          {(comparison || hasFlow) && (
            <>
              · 망설인 답변: &quot;잘 모르겠어&quot;를 누르거나 30초 넘게 답을 시작하지 못한 경우
              <br />
            </>
          )}
          · 점수·퍼센트·답변 길이는 쓰지 않아요
        </p>
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
