import { Link } from 'react-router';
import brandSymbol from '../../assets/brand/brand-symbol-small.svg';
import wordmark from '../../assets/brand/wordmark-small.svg';
import profileIcon from '../../assets/icons/profile.svg';
import styles from './HomeBar.module.css';

export default function HomeBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.logo}>
        <img src={brandSymbol} alt="" width="28" height="28" />
        <img src={wordmark} alt="TEACHMi" width="71" height="19" />
      </div>
      <Link className={styles.profile} to="/my" aria-label="내 정보">
        <img src={profileIcon} alt="" width="24" height="24" />
      </Link>
    </div>
  );
}
