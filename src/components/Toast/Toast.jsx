import { useEffect, useRef } from 'react';
import styles from './Toast.module.css';

// 잠깐 나타났다 사라지는 안내 문구입니다.
// open이 true가 되면 duration(ms) 뒤에 onClose가 호출됩니다.
export default function Toast({ open, onClose, duration = 3000, children }) {
  // 부모가 다시 그려져도 타이머가 처음부터 다시 시작되지 않도록 ref에 보관합니다.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => onCloseRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);

  // 화면 낭독기가 알아채도록 바깥 영역은 항상 그려 둡니다.
  return (
    <div className={styles.region} role="status">
      {open && <div className={styles.toast}>{children}</div>}
    </div>
  );
}
