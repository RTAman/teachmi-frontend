import { Link } from 'react-router';
import bubbleGotIt from '../../assets/characters/bubble-got-it.png';
import chevronIcon from '../../assets/icons/chevron-right.svg';
import AppShell from '../../components/AppShell/AppShell';
import BottomNav from '../../components/BottomNav/BottomNav';
import HomeBar from '../../components/HomeBar/HomeBar';
import Tag from '../../components/Tag/Tag';
import { RECORDS } from '../Records/recordSamples';
import styles from './ReportsPage.module.css';

const LATEST_SUMMARY = '혼자 말한 핵심 요소 1 → 3개';

export default function ReportsPage() {
  const reports = RECORDS.filter((record) => !record.inProgress);
  const [latest, ...past] = reports;

  return (
    <AppShell plainHeader header={<HomeBar />} footer={<BottomNav />}>
      <div className={styles.page}>
        <div>
          <h1 className={styles.heading}>성장 리포트</h1>
          <p className={styles.sub}>학습을 마칠 때마다 리포트가 쌓여요</p>
        </div>

        {latest ? (
          <Link className={styles.latest} to="/learn/report">
            <img src={bubbleGotIt} alt="" width="56" height="56" />
            <span className={styles.latestText}>
              <span className={styles.latestLabel}>가장 최근 리포트</span>
              <strong>
                {latest.subject} · {latest.title}
              </strong>
              <span className={styles.latestMeta}>
                {latest.meta} · {LATEST_SUMMARY}
              </span>
            </span>
            <img src={chevronIcon} alt="" width="20" height="20" />
          </Link>
        ) : (
          <p className={styles.empty}>아직 리포트가 없어요. 학습을 마치면 여기에 생겨요.</p>
        )}

        {past.length > 0 && (
          <section aria-labelledby="past-title">
            <h2 id="past-title" className={styles.sectionTitle}>
              지난 리포트
            </h2>
            <ul className={styles.list}>
              {past.map((report) => (
                <li key={report.id}>
                  <Link className={styles.card} to="/learn/report">
                    <span className={styles.cardBody}>
                      <span className={styles.cardTop}>
                        <strong>{report.title}</strong>
                        <span className={styles.meta}>{report.meta}</span>
                      </span>
                      <span className={styles.subject}>{report.subject}</span>
                      <span className={styles.tags}>
                        {report.tags.map((tag) => (
                          <Tag key={tag.text} tone={tag.tone}>
                            {tag.text}
                          </Tag>
                        ))}
                      </span>
                    </span>
                    <img src={chevronIcon} alt="" width="20" height="20" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AppShell>
  );
}
