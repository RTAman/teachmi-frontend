import ButtonRow from '../Button/ButtonRow';
import styles from './BottomCTA.module.css';

// 화면 하단 버튼 영역입니다. AppShell의 footer에 넣어 사용합니다.
// 키보드가 올라오면 AppShell이 줄어들면서 함께 위로 이동합니다.
export default function BottomCTA({ children }) {
  return (
    <div className={styles.cta}>
      <ButtonRow>{children}</ButtonRow>
    </div>
  );
}
