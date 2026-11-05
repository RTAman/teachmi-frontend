import styles from './Skeleton.module.css';

// 로딩 중에 내용 자리를 보여 주는 회색 상자입니다.
export default function Skeleton({ width = '100%', height = 10, radius = 5 }) {
  return (
    <span
      className={styles.skeleton}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
