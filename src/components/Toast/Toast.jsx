import { useEffect, useRef } from 'react';
import styles from './Toast.module.css';

export default function Toast({ open, onClose, duration = 3000, children }) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => onCloseRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);

  return (
    <div className={styles.region} role="status">
      {open && <div className={styles.toast}>{children}</div>}
    </div>
  );
}
