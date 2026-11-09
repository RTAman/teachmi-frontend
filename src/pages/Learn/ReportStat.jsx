import styles from './ReportPage.module.css';

function Slope({ before, after }) {
  const max = Math.max(before, after, 1);
  const y = (value) => 8 + (1 - value / max) * 34;
  return (
    <svg className={styles.slope} viewBox="0 0 137 50" aria-hidden="true">
      <line x1="8" y1={y(before)} x2="129" y2={y(after)} className={styles.slopeLine} />
      <circle cx="8" cy={y(before)} r="6" className={styles.slopeBefore} />
      <circle cx="129" cy={y(after)} r="6" className={styles.slopeAfter} />
    </svg>
  );
}

export default function ReportStat({ icon, title, before, after }) {
  const diff = before - after;
  return (
    <section className={styles.stat}>
      <h3 className={styles.statTitle}>
        <img src={icon} alt="" width="32" height="32" />
        {title}
      </h3>
      <p className={styles.statNumbers}>
        <span className={styles.statBefore}>{before}</span>
        <span className={styles.statArrow} aria-hidden="true">
          →
        </span>
        <strong>{after}</strong>
        <span className={styles.statUnit}>회</span>
      </p>
      <Slope before={before} after={after} />
      <p className={styles.slopeLabels}>
        <span>지난</span>
        <span>이번</span>
      </p>
      <span className={`${styles.delta} ${diff > 0 ? '' : styles.deltaNeutral}`}>
        {diff > 0 ? `${diff}회 줄었어요` : diff < 0 ? `${-diff}회 늘었어요` : '지난번과 같아요'}
      </span>
    </section>
  );
}
