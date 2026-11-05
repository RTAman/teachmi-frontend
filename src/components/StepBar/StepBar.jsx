import styles from './StepBar.module.css';

const TOTAL_STEPS = 5;

export default function StepBar({ current, label, thin = false }) {
  const steps = Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1);

  const track = (
    <div
      className={`${styles.track} ${thin ? styles.trackThin : ''}`}
      role="progressbar"
      aria-label={label ? `학습 단계: ${label}` : '학습 단계'}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-valuenow={current}
    >
      {steps.map((step) => (
        <span key={step} className={`${styles.segment} ${step <= current ? styles.on : ''}`} />
      ))}
    </div>
  );

  if (thin) return track;

  return (
    <div className={styles.wrap}>
      <div className={styles.labels}>
        <span className={styles.label}>
          {String(current).padStart(2, '0')} {label}
        </span>
        <span className={styles.count}>
          {current} / {TOTAL_STEPS}
        </span>
      </div>
      {track}
    </div>
  );
}
