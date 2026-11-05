import styles from './Tag.module.css';

// tone은 Figma의 Tag 규칙을 따릅니다.
// ok: 정답·확인됨 / ai: 힌트 도움 / warn: 부족·첫 오답
// bad: 오답 / neutral: 부분·미확인·판정 보류 / lime: 다음 학습
export default function Tag({ tone = 'ok', children }) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>;
}
