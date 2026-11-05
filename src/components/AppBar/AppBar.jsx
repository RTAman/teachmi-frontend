import backIcon from '../../assets/icons/back.svg';
import styles from './AppBar.module.css';

// title: 제목 / subtitle: 제목 아래 작은 글자 (S05)
// onBack: 넘기면 뒤로 가기 버튼 표시
// actionLabel, onAction: 오른쪽 글자 버튼 (S05 "설명 마치기")
// counter: 오른쪽 숫자 표시 (S06 "1 / 2")
export default function AppBar({ title, subtitle, onBack, actionLabel, onAction, counter }) {
  return (
    <div className={`${styles.bar} ${onBack ? '' : styles.noBack}`}>
      {onBack && (
        <button type="button" className={styles.back} onClick={onBack} aria-label="뒤로 가기">
          <img src={backIcon} alt="" width="24" height="24" />
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
