import backIcon from '../../assets/icons/back.svg';
import closeIcon from '../../assets/icons/close.svg';
import styles from './AppBar.module.css';

export default function AppBar({ title, subtitle, onBack, onClose, actionLabel, onAction, counter }) {
  return (
    <div className={`${styles.bar} ${onBack || onClose ? '' : styles.noBack}`}>
      {onBack && (
        <button type="button" className={styles.back} onClick={onBack} aria-label="뒤로 가기">
          <img src={backIcon} alt="" width="24" height="24" />
        </button>
      )}
      {onClose && (
        <button type="button" className={styles.back} onClick={onClose} aria-label="닫기">
          <img src={closeIcon} alt="" width="22" height="22" />
        </button>
      )}
      <div className={styles.text}>
        <h1 className={`${styles.title} ${subtitle ? styles.titleWithSubtitle : ''}`}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {counter && <span className={styles.counter}>{counter}</span>}
      {actionLabel && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
