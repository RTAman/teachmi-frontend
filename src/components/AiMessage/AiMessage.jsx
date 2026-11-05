import styles from './AiMessage.module.css';

export default function AiMessage({ avatar, label, typing = false, as: Tag = 'div', children }) {
  return (
    <Tag className={styles.ai}>
      <img src={avatar} alt="" width="32" height="32" />
      <div className={styles.column}>
        <p className={styles.name}>
          AI 학생{label && ` · ${label}`}
        </p>
        {typing ? (
          <p className={`${styles.bubble} ${styles.typing}`}>
            <span className={styles.hidden}>AI 학생이 답을 쓰고 있어요</span>
            <span aria-hidden="true">···</span>
          </p>
        ) : (
          <p className={styles.bubble}>{children}</p>
        )}
      </div>
    </Tag>
  );
}
