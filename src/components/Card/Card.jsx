import styles from './Card.module.css';

// 내용을 담는 기본 카드입니다. 카드 사이 간격은 AppShell이 처리합니다.
// padding: 안쪽 여백(px). 디자인에서 16 또는 20을 사용합니다.
export default function Card({ padding = 16, children }) {
  return (
    <div className={styles.card} style={{ padding }}>
      {children}
    </div>
  );
}
