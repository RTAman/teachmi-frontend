import ButtonRow from '../Button/ButtonRow';
import styles from './BottomCTA.module.css';

export default function BottomCTA({ stacked = false, children }) {
  return (
    <div className={styles.cta}>
      {stacked ? <div className={styles.stack}>{children}</div> : <ButtonRow>{children}</ButtonRow>}
    </div>
  );
}
