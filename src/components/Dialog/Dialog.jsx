import { useId } from 'react';
import useModalDialog from '../../hooks/useModalDialog';
import ButtonRow from '../Button/ButtonRow';
import styles from './Dialog.module.css';

// 확인 창입니다. (S05-5 그만하기, S06-4 나가기)
// character: 캐릭터 자리, actions: 버튼들
export default function Dialog({ open, onClose, character, title, children, actions }) {
  const ref = useModalDialog(open);
  const titleId = useId();

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Esc를 눌렀을 때 open 값과 실제 상태가 어긋나지 않도록 부모에게 맡깁니다.
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
