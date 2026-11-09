import { useLocation, useNavigate } from 'react-router';
import arrowIcon from '../../assets/icons/arrow-right.svg';
import checkIcon from '../../assets/icons/check-ok.svg';
import infoIcon from '../../assets/icons/info.svg';
import { useAuth } from '../../auth/authContext';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import StepBar from '../../components/StepBar/StepBar';
import Tag from '../../components/Tag/Tag';
import LiveReportDetail from './LiveReportDetail';
import { summarizeProblems } from './reportResults';
import { SAMPLE_PROBLEM_RECORDS, SAMPLE_REPORT } from './reportSamples';
import styles from './ReportDetailPage.module.css';

export default function ReportDetailPage() {
  const { status } = useAuth();
  return status === 'in' ? <LiveReportDetail /> : <DemoReportDetail />;
}

function DemoReportDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const report = SAMPLE_REPORT;
  const problems = summarizeProblems(state?.problems ?? SAMPLE_PROBLEM_RECORDS);
  const solvedAlone = problems.filter((problem) => problem.solvedAlone).length;
  const missed = problems.filter((problem) => problem.tone === 'bad').length;
  const areas = [
    ...report.areas,
    {
      title: '독립 적용',
      tag: `${problems.length}문제 중 ${solvedAlone}개`,
      tone: solvedAlone === problems.length ? 'ok' : 'warn',
      text: '힌트 없이 풀었어요',
    },
    {
      title: '다음 학습',
      tag: missed > 0 ? `보완 ${missed}개` : '이어서 배우기',
      tone: missed > 0 ? 'neutral' : 'lime',
      text: missed > 0 ? '틀린 문제의 계산 과정' : '다음 개념으로 넘어가도 좋아요',
    },
  ];
  const relearn = () => navigate('/learn/chat', { state: { ...state, mode: 'review' } });

  return (
    <AppShell
      header={
        <>
          <AppBar title="학습 내용 자세히" onBack={() => navigate('/learn/report', { state })} />
          <StepBar current={5} label="성장 확인" />
        </>
      }
      footer={
        <BottomCTA>
          <Button variant="secondary" onClick={() => navigate('/home')}>
            홈으로
          </Button>
          <Button onClick={relearn}>한 번 더 설명하기</Button>
        </BottomCTA>
      }
    >
      <div className={styles.page}>
        <section aria-labelledby="change-title">
          <h2 id="change-title" className={styles.title}>
            설명의 변화
          </h2>
          <div className={styles.first}>
            <p className={styles.label}>학습 초기 · 첫 답변</p>
            <p className={styles.quote}>“{report.firstAnswer}”</p>
          </div>
          <p className={styles.cap}>
            <img src={arrowIcon} alt="" width="18" height="18" />
            AI 학생과 {report.turnCount}번 대화 · 힌트 {report.hintCount}회
          </p>
          <div className={styles.final}>
            <p className={`${styles.label} ${styles.finalLabel}`}>학습 후 · 최종 설명</p>
            <p className={styles.finalQuote}>
              “
              {report.finalExplanation.map((part) =>
                part.mark ? <mark key={part.text}>{part.text}</mark> : part.text,
              )}
              ”
            </p>
            <hr />
            <p className={styles.label}>새로 포함된 핵심 요소</p>
            <ul className={styles.chips}>
              {report.newElements.map((element) => (
                <li key={element}>
                  <img src={checkIcon} alt="" width="13" height="13" />
                  {element}
                </li>
              ))}
            </ul>
          </div>
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
            {problems.map((problem) => (
              <li key={problem.id}>
                <div className={styles.problemTop}>
                  <h3>{problem.title}</h3>
                  <Tag tone={problem.tone}>{problem.tag}</Tag>
                </div>
                <p>{problem.meta}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="understood-title">
          <h2 id="understood-title" className={styles.title}>
            이해한 내용
          </h2>
          <ul className={`${styles.box} ${styles.understood}`}>
            {report.understood.map((text) => (
              <li key={text}>
                <span className={styles.okDot}>
                  <img src={checkIcon} alt="" width="14" height="14" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="improve-title">
          <h2 id="improve-title" className={styles.title}>
            보완할 내용
          </h2>
          <div className={styles.box}>
            <ol className={styles.improve}>
              {report.improve.map((item, index) => (
                <li key={item.title}>
                  <span className={index === 0 ? styles.numWarn : styles.num}>{index + 1}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <button type="button" className={styles.again} onClick={relearn}>
              이 부분 다시 설명하기
            </button>
          </div>
        </section>

        <p className={styles.note}>
          <img src={infoIcon} alt="" width="18" height="18" />
          힌트를 받은 설명과 혼자 푼 문제 결과를 나눠서 보여 줘요. 대화 길이나 답변 길이는 결과에 반영하지 않아요.
        </p>
      </div>
    </AppShell>
  );
}
