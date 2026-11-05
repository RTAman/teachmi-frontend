import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import bubbleCurious from '../../assets/characters/bubble-curious.png';
import chevronIcon from '../../assets/icons/chevron-right.svg';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomNav from '../../components/BottomNav/BottomNav';
import Tag from '../../components/Tag/Tag';
import { RECOMMENDATION, RECORDS } from './recordSamples';
import styles from './RecordsPage.module.css';

const ALL = '전체';

export default function RecordsPage() {
  const navigate = useNavigate();
  const subjects = [...new Set(RECORDS.map((record) => record.subject))];
  const [filter, setFilter] = useState(ALL);
  const visibleSubjects = filter === ALL ? subjects : [filter];

  return (
    <AppShell
      header={
        <>
          <AppBar title="나의 학습 기록" onBack={() => navigate('/home')} />
          <div className={styles.filters} role="group" aria-label="과목 필터">
            {[ALL, ...subjects].map((subject) => (
              <button
                key={subject}
                type="button"
                className={`${styles.filter} ${filter === subject ? styles.filterOn : ''}`}
                aria-pressed={filter === subject}
                onClick={() => setFilter(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
        </>
      }
      footer={<BottomNav />}
    >
      <div className={styles.page}>
        <section className={styles.recommend} aria-labelledby="recommend-title">
          <div className={styles.recommendBody}>
            <img src={bubbleCurious} alt="" width="32" height="32" />
            <div>
              <p className={styles.recommendLabel}>AI 추천 · 다시 설명해 볼 개념</p>
              <h2 id="recommend-title" className={styles.recommendTitle}>
                {RECOMMENDATION.subject} · {RECOMMENDATION.concept}
              </h2>
              <p className={styles.recommendText}>{RECOMMENDATION.reason}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.start}
            onClick={() =>
              navigate('/learn/mode', {
                state: { subject: RECOMMENDATION.subject, concept: { name: RECOMMENDATION.concept } },
              })
            }
          >
            학습 시작
          </button>
        </section>

        {visibleSubjects.map((subject) => (
          <section key={subject} aria-labelledby={`subject-${subject}`}>
            <h2 id={`subject-${subject}`} className={styles.subject}>
              {subject}
            </h2>
            <ul className={styles.cards}>
              {RECORDS.filter((record) => record.subject === subject).map((record) => (
                <li key={record.id}>
                  <Link
                    className={`${styles.card} ${record.inProgress ? styles.cardActive : ''}`}
                    to={record.inProgress ? '/learn/chat' : '/learn/report'}
                  >
                    <span className={styles.cardBody}>
                      <span className={styles.cardTop}>
                        <strong>{record.title}</strong>
                        <span className={styles.meta}>{record.meta}</span>
                      </span>
                      <span className={styles.tags}>
                        {record.tags.map((tag) => (
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
        ))}
      </div>
    </AppShell>
  );
}
