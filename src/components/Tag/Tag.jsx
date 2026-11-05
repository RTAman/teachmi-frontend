import styles from './Tag.module.css';

export default function Tag({ tone = 'ok', children }) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>;
}
