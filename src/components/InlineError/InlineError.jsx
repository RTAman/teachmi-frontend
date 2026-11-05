import styles from './InlineError.module.css';

export default function InlineError({ id, children }) {
  return (
    <p id={id} className={styles.error} role="alert">
      {children}
    </p>
  );
}
