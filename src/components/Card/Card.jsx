import styles from './Card.module.css';

export default function Card({ padding = 16, children }) {
  return (
    <div className={styles.card} style={{ padding }}>
      {children}
    </div>
  );
}
