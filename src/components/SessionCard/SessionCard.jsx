import { Link } from 'react-router';
import chevronIcon from '../../assets/icons/chevron-right.svg';
import Tag from '../Tag/Tag';
import styles from './SessionCard.module.css';

const TOTAL_STEPS = 5;

export default function SessionCard({ meta, title, tags = [], to, inProgress }) {
  if (inProgress) {
    const steps = Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1);

    return (
      <div className={`${styles.card} ${styles.progressCard}`}>
        <div className={styles.between}>
          <div>
            <p className={styles.meta}>{meta}</p>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <Link className={styles.resume} to={to}>
            이어하기
          </Link>
        </div>
        <div
          className={styles.track}
          role="progressbar"
          aria-label={`${title} 진행 단계`}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={inProgress.step}
        >
          {steps.map((step) => (
            <span
              key={step}
              className={`${styles.segment} ${step <= inProgress.step ? styles.on : ''}`}
            />
          ))}
        </div>
        <p className={styles.status}>{inProgress.label}</p>
      </div>
    );
  }

  return (
    <Link className={styles.card} to={to}>
      <div className={styles.between}>
        <div>
          <p className={styles.meta}>{meta}</p>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <img className={styles.chevron} src={chevronIcon} alt="" width="20" height="20" />
      </div>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <Tag key={tag.label} tone={tag.tone}>
            {tag.label}
          </Tag>
        ))}
      </div>
    </Link>
  );
}
