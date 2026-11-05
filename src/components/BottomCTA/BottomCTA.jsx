import ButtonRow from '../Button/ButtonRow';
import styles from './BottomCTA.module.css';

export default function BottomCTA({ children }) {
  return (
    <div className={styles.cta}>
      <ButtonRow>{children}</ButtonRow>
    </div>
  );
}
