import styles from './InlineError.module.css';

// 입력칸이나 영역 바로 아래에 표시하는 오류 문구입니다.
export default function InlineError({ id, children }) {
  return (
    <p id={id} className={styles.error} role="alert">
      {children}
    </p>
  );
}
