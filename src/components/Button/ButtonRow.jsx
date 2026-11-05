import styles from './ButtonRow.module.css';

export default function ButtonRow({ children }) {
  return <div className={styles.row}>{children}</div>;
}
