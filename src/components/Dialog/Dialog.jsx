import { useId } from 'react';
import useModalDialog from '../../hooks/useModalDialog';
import ButtonRow from '../Button/ButtonRow';
import styles from './Dialog.module.css';

export default function Dialog({ open, onClose, character, title, children, actions }) {
  const ref = useModalDialog(open);
  const titleId = useId();

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
    >
      {character && <div className={styles.character}>{character}</div>}
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {children && <div className={styles.body}>{children}</div>}
      {actions && (
        <div className={styles.actions}>
          <ButtonRow>{actions}</ButtonRow>
        </div>
      )}
    </dialog>
  );
}
