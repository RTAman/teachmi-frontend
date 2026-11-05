import { useId } from 'react';
import closeIcon from '../../assets/icons/close.svg';
import useModalDialog from '../../hooks/useModalDialog';
import ButtonRow from '../Button/ButtonRow';
import styles from './BottomSheet.module.css';

// 아래에서 올라오는 시트입니다. (S02-5 개념 직접 입력·수정)
// actions: 맨 아래 버튼들
// 닫기 버튼, 바깥 어두운 영역, Esc 키를 누르면 onClose가 호출됩니다.
export default function BottomSheet({ open, onClose, title, children, actions }) {
  const ref = useModalDialog(open);
  const titleId = useId();

  return (
    <dialog
      ref={ref}
      className={styles.sheet}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClick={(event) => {
        // 내용은 .inner가 덮고 있어서, dialog 자신이 눌렸다면 바깥 영역을 누른 것입니다.
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className={styles.inner}>
        <span className={styles.grab} aria-hidden="true" />
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">
            <img src={closeIcon} alt="" width="22" height="22" />
          </button>
        </div>
        {children}
        {actions && (
          <div className={styles.actions}>
            <ButtonRow>{actions}</ButtonRow>
          </div>
        )}
      </div>
    </dialog>
  );
}
