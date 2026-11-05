import { Link, useSearchParams } from 'react-router';
import bubbleCurious from '../../assets/characters/bubble-curious.png';
import emotionCoral from '../../assets/characters/emotion-coral.png';
import emotionMint from '../../assets/characters/emotion-mint.png';
import emotionSunny from '../../assets/characters/emotion-sunny.png';
import plusIcon from '../../assets/icons/plus.svg';
import AppShell from '../../components/AppShell/AppShell';
import BottomNav from '../../components/BottomNav/BottomNav';
import HomeBar from '../../components/HomeBar/HomeBar';
import SessionCard from '../../components/SessionCard/SessionCard';
import StepList from '../../components/StepList/StepList';
import StreakBadge from '../../components/StreakBadge/StreakBadge';
import { FIRST_USE_STEPS, HOME_SAMPLES } from './homeSamples';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const home = HOME_SAMPLES[searchParams.get('state')] ?? HOME_SAMPLES.records;
  const isFirstUse = home.sessions.length === 0;

  return (
    <AppShell plainHeader header={<HomeBar />} footer={<BottomNav />}>
      <div className={styles.page}>
        <div className={isFirstUse ? styles.introFirst : styles.intro}>
          {home.showCharacters && (
            <div className={styles.characters}>
              <img src={emotionCoral} alt="" width="52" height="52" />
              <img src={emotionSunny} alt="" width="52" height="52" />
              <img src={emotionMint} alt="" width="52" height="52" />
            </div>
          )}
          <h1 className={styles.heading}>
            {home.heading[0]}
            <br />
            {home.heading[1]}
          </h1>
          <p className={styles.subheading}>{home.subheading}</p>
        </div>

        {home.streak && <StreakBadge {...home.streak} />}

        <section className={styles.hero}>
          <div className={styles.say}>
            <img src={bubbleCurious} alt="" width="40" height="40" />
            <p className={styles.bubble}>{home.message}</p>
          </div>
          <Link className={styles.start} to="/learn">
            <img src={plusIcon} alt="" width="20" height="20" />새 학습 시작
          </Link>
        </section>

        {isFirstUse ? (
          <StepList title="이렇게 진행돼요" steps={FIRST_USE_STEPS} />
        ) : (
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>최근 학습</h2>
              <Link className={styles.viewAll} to="/records">
                전체 보기
              </Link>
            </div>
            <div className={styles.sessions}>
              {home.sessions.map(({ id, ...session }) => (
                <SessionCard key={id} {...session} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
