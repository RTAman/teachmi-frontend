import { Link } from 'react-router';
import bubbleGotIt from '../../assets/characters/bubble-got-it.png';
import chevronIcon from '../../assets/icons/chevron-right.svg';
import { useAuth } from '../../auth/authContext';
import AppShell from '../../components/AppShell/AppShell';
import BottomNav from '../../components/BottomNav/BottomNav';
import HomeBar from '../../components/HomeBar/HomeBar';
import Skeleton from '../../components/Skeleton/Skeleton';
import Tag from '../../components/Tag/Tag';
import useLiveHome from '../Home/useLiveHome';
import { RECORDS } from '../Records/recordSamples';
import styles from './ReportsPage.module.css';

const LATEST_SUMMARY = '혼자 말한 핵심 요소 1 → 3개';

function toLiveReport(card) {
  return {
    ...card,
    summary: card.tags[0].label,
    tags: card.tags.map((tag) => ({ tone: tag.tone, text: tag.label })),
  };
}

export default function ReportsPage() {
  const { status } = useAuth();
  const live = status === 'in';
  const { home, failed } = useLiveHome(live);
  const reports = live
    ? (home?.sessions ?? []).filter((card) => !card.inProgress).map(toLiveReport)
    : RECORDS.filter((record) => !record.inProgress).map((record) => ({ ...record, summary: LATEST_SUMMARY }));
  const [latest, ...past] = reports;
  const loading = live && !home && !failed;

  return (
    <AppShell plainHeader header={<HomeBar />} footer={<BottomNav />}>
      <div className={styles.page}>
        <div>
          <h1 className={styles.heading}>성장 리포트</h1>
          <p className={styles.sub}>{live ? '최근 리포트만 보여 줘요' : '학습을 마칠 때마다 리포트가 쌓여요'}</p>
        </div>

        {loading && <Skeleton height={108} radius={24} />}
        {failed && <p className={styles.empty}>리포트를 불러오지 못했어요.</p>}
        {!loading && !failed && !latest && (
          <p className={styles.empty}>아직 리포트가 없어요. 학습을 마치면 여기에 생겨요.</p>
        )}
        {latest && (
          <Link className={styles.latest} to="/learn/report" state={latest.linkState}>
            <img src={bubbleGotIt} alt="" width="56" height="56" />
            <span className={styles.latestText}>
              <span className={styles.latestLabel}>가장 최근 리포트</span>
              <strong>{latest.subject ? `${latest.subject} · ${latest.title}` : latest.title}</strong>
              <span className={styles.latestMeta}>
                {latest.meta} · {latest.summary}
              </span>
            </span>
            <img src={chevronIcon} alt="" width="20" height="20" />
          </Link>
        )}

        {past.length > 0 && (
          <section aria-labelledby="past-title">
            <h2 id="past-title" className={styles.sectionTitle}>
              지난 리포트
            </h2>
            <ul className={styles.list}>
              {past.map((report) => (
                <li key={report.id}>
                  <Link className={styles.card} to="/learn/report" state={report.linkState}>
                    <span className={styles.cardBody}>
                      <span className={styles.cardTop}>
                        <strong>{report.title}</strong>
                        <span className={styles.meta}>{report.meta}</span>
                      </span>
                      {report.subject && <span className={styles.subject}>{report.subject}</span>}
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
