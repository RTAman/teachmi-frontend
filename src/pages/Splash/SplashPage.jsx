import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import brandSymbol from '../../assets/brand/brand-symbol-large.svg';
import wordmark from '../../assets/brand/wordmark.svg';
import styles from './SplashPage.module.css';

const SPLASH_DURATION = 2000;

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login', { replace: true }), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.page}>
      <img src={brandSymbol} alt="" width="148" height="148" />
      <h1 className={styles.logo}>
        <img src={wordmark} alt="TEACHMi" width="156" height="42" />
      </h1>
      <p className={styles.tagline}>설명하면서 배우는 AI 학생</p>
    </div>
  );
}
