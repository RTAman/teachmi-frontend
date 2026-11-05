import useKeyboardInset from '../../hooks/useKeyboardInset';
import styles from './AppShell.module.css';

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
