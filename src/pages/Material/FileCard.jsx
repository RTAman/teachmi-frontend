import closeIcon from '../../assets/icons/close-faint.svg';
import Tag from '../../components/Tag/Tag';
import styles from './FileCard.module.css';

function extensionOf(name) {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? 'TXT' : name.slice(dot + 1).toUpperCase();
}

export default function FileCard({ name, meta, failed = false, compact = false, onRemove, removeLabel }) {
  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <span className={styles.ext} aria-hidden="true">
        {extensionOf(name)}
      </span>
      <div className={styles.text}>
        <p className={styles.name}>{name}</p>
        {!compact && meta && <p className={failed ? styles.failed : styles.meta}>{meta}</p>}
      </div>
      {compact && <Tag tone="ok">분석 완료</Tag>}
      {onRemove && (
        <button type="button" className={styles.remove} onClick={onRemove} aria-label={removeLabel}>
          <img src={closeIcon} alt="" width="22" height="22" />
        </button>
      )}
    </div>
  );
}
