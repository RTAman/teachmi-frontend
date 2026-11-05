import useKeyboardInset from '../../hooks/useKeyboardInset';
import styles from './AppShell.module.css';

// 모든 화면을 감싸는 틀입니다. 가운데 내용만 스크롤되고 위아래는 고정됩니다.
// header: AppBar, StepBar 등 / footer: BottomCTA 등
export default function AppShell({ header, footer, children }) {
  useKeyboardInset();

  return (
    <div className={styles.shell}>
      {header && <header className={styles.header}>{header}</header>}
      <main className={styles.content}>{children}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}
