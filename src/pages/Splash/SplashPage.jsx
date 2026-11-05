import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import brandSymbol from '../../assets/brand/brand-symbol-large.svg';
import wordmark from '../../assets/brand/wordmark.svg';
import { useAuth } from '../../auth/authContext';
import styles from './SplashPage.module.css';

const SPLASH_DURATION = 2000;

export default function SplashPage() {
  const navigate = useNavigate();
  const { status } = useAuth();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShown(true), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shown || status === 'checking') return;
    navigate(status === 'in' ? '/home' : '/login', { replace: true });
  }, [shown, status, navigate]);

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
