import styles from './Skeleton.module.css';

export default function Skeleton({ width = '100%', height = 10, radius = 5 }) {
  return (
    <span
      className={styles.skeleton}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
