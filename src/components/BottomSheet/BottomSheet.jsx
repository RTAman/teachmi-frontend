import { useId } from 'react';
import closeIcon from '../../assets/icons/close.svg';
import useModalDialog from '../../hooks/useModalDialog';
import ButtonRow from '../Button/ButtonRow';
import styles from './BottomSheet.module.css';

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
