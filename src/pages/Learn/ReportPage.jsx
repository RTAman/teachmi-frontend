import { useLocation, useNavigate } from 'react-router';
import bubbleGotIt from '../../assets/characters/bubble-got-it.png';
import chevronIcon from '../../assets/icons/chevron-right.svg';
import hintBadge from '../../assets/icons/hint-badge.svg';
import stuckBadge from '../../assets/icons/stuck-badge.svg';
import { useAuth } from '../../auth/authContext';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import StepBar from '../../components/StepBar/StepBar';
import FlowChart from './FlowChart';
import LiveReport from './LiveReport';
import ReportStat from './ReportStat';
import { SAMPLE_REPORT } from './reportSamples';
import styles from './ReportPage.module.css';

export default function ReportPage() {
  const { status } = useAuth();
  return status === 'in' ? <LiveReport /> : <DemoReport />;
}

function DemoReport() {
  const navigate = useNavigate();
  const { state, search } = useLocation();
  const firstTime = new URLSearchParams(search).get('first') === '1';
  const report = firstTime ? { ...SAMPLE_REPORT, comparedWith: null } : SAMPLE_REPORT;
  const gained = report.elements.after - report.elements.before;

  return (
    <AppShell
      header={
        <>
          <AppBar title="학습 결과" onClose={() => navigate('/home')} />
          <StepBar current={5} label="성장 확인" />
        </>
      }
      footer={
        <BottomCTA>
          <Button variant="secondary" onClick={() => navigate('/home')}>
            홈으로
          </Button>
          <Button onClick={() => navigate('/learn/chat', { state: { ...state, mode: 'review' } })}>
            한 번 더 설명하기
          </Button>
        </BottomCTA>
      }
    >
      <div className={styles.page}>
        <div>
          <h2 className={styles.heading}>이번 학습에서 이만큼 성장했어요</h2>
          <p className={styles.sub}>
            {report.comparedWith
              ? `같은 개념을 처음 공부한 ${report.comparedWith}과 비교했어요`
              : '처음 배우는 개념이라 이번 대화의 흐름을 보여 줘요'}
          </p>
        </div>

        {report.comparedWith && (
          <>
            <section className={styles.highlight} aria-label="혼자 말한 핵심 요소">
              {gained > 0 && <img src={bubbleGotIt} alt="" width="76" height="76" />}
              <div>
                <p className={styles.highlightLabel}>혼자 말한 핵심 요소</p>
                <p className={styles.highlightNumbers}>
                  <span className={styles.before}>{report.elements.before}</span>
                  <span className={styles.bigArrow} aria-hidden="true">
                    →
                  </span>
                  <strong>{report.elements.after}</strong>
                  <span className={styles.unit}>개</span>
                </p>
                <span className={styles.highlightDelta}>
                  {gained > 0 ? `+${gained}개 늘었어요` : '이번에도 같은 만큼 설명했어요'}
                </span>
              </div>
            </section>

            <div className={styles.stats}>
              <ReportStat icon={hintBadge} title="힌트 사용" {...report.hints} />
              <ReportStat icon={stuckBadge} title="망설인 답변" {...report.stuck} />
            </div>
          </>
        )}

        <section className={styles.flow}>
          <h3 className={styles.flowTitle}>대화 흐름</h3>
          <p className={styles.sub}>{report.flowSummary}</p>
          <FlowChart
            turns={report.turns}
            label={`대화 ${report.turns.length}턴 동안 혼자 말한 핵심 요소가 ${report.turns[0].count}개에서 ${report.turns.at(-1).count}개로 늘었어요`}
            callout={`혼자 ${report.turns.at(-1).count}개 설명!`}
          />
          <ul className={styles.legend}>
            <li>
              <span className={styles.legendRing} />
              핵심 요소 (누적)
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

        <p className={styles.footnote}>
          · 망설인 답변: &quot;잘 모르겠어&quot;를 누르거나 30초 넘게 답을 시작하지 못한 경우
          <br />· 점수·퍼센트·답변 길이는 쓰지 않아요
        </p>

        <button type="button" className={styles.detail} onClick={() => navigate('/learn/report/detail', { state })}>
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
