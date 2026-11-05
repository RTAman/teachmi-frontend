import { useLocation, useNavigate } from 'react-router';
import bubbleCurious from '../../assets/characters/bubble-curious.png';
import arrowIcon from '../../assets/icons/arrow-right.svg';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import StepBar from '../../components/StepBar/StepBar';
import { SAMPLE_SESSION, SAMPLE_SUMMARY } from './learnSamples';
import styles from './SummaryPage.module.css';

export default function SummaryPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { core, example, terms, question } = SAMPLE_SUMMARY;

  return (
    <AppShell
      header={
        <>
          <AppBar title="사전 학습" onBack={() => navigate('/learn/mode', { state })} />
          <StepBar current={3} label="개념 정리" />
        </>
      }
      footer={
        <BottomCTA>
          <Button onClick={() => navigate('/learn/chat', { state })}>
            AI 학생에게 설명하러 가기
            <img src={arrowIcon} alt="" width="18" height="18" />
          </Button>
        </BottomCTA>
      }
    >
      <div className={styles.page}>
        <div>
          <p className={styles.eyebrow}>오늘의 개념</p>
          <h2 className={styles.title}>{SAMPLE_SESSION.title}</h2>
          <p className={styles.source}>{SAMPLE_SESSION.source}</p>
        </div>

        <section className={`${styles.card} ${styles.coreCard}`} aria-labelledby="core-title">
          <h3 id="core-title" className={styles.cardTitle}>
            핵심 개념
          </h3>
          <p className={styles.core}>
            {core.map((part) => (part.strong ? <strong key={part.text}>{part.text}</strong> : part.text))}
          </p>
        </section>

        <section className={styles.card} aria-labelledby="example-title">
          <h3 id="example-title" className={styles.cardTitle}>
            이렇게 생각해 보세요
          </h3>
          <p className={styles.example}>{example.text}</p>
          <div className={styles.split}>
            <p className={styles.total}>
              취득원가 <span>{example.total}</span>
            </p>
            <ul className={styles.years}>
              {example.years.map((year) => (
                <li key={year.label}>
                  <span className={styles.yearLabel}>{year.label}</span>
                  <span className={styles.yearAmount}>{year.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.card} aria-labelledby="terms-title">
          <h3 id="terms-title" className={styles.cardTitle}>
            핵심 용어
          </h3>
          <ul className={styles.terms}>
            {terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </section>

        <section className={styles.think} aria-labelledby="think-title">
          <img src={bubbleCurious} alt="" width="32" height="32" />
          <div>
            <h3 id="think-title" className={styles.thinkTitle}>
              생각해 볼 점
            </h3>
            <p className={styles.thinkText}>{question}</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
