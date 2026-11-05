import styles from './ButtonRow.module.css';

// 안에 넣은 버튼을 같은 폭으로 나눕니다. 1개면 1열, 2개면 2열이 됩니다.
export default function ButtonRow({ children }) {
  return <div className={styles.row}>{children}</div>;
}
