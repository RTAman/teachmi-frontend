import { useState } from 'react';
import { Link } from 'react-router';
import brandSymbol from '../../assets/brand/brand-symbol.svg';
import wordmark from '../../assets/brand/wordmark.svg';
import googleIcon from '../../assets/icons/google.svg';
import kakaoIcon from '../../assets/icons/kakao.svg';
import Button from '../../components/Button/Button';
import Toast from '../../components/Toast/Toast';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [toastOpen, setToastOpen] = useState(false);
  const showNotReady = () => setToastOpen(true);

  return (
    <div className={styles.page}>
      <div className={styles.brand}>
        <img src={brandSymbol} alt="" width="104" height="104" />
        <h1 className={styles.logo}>
          <img src={wordmark} alt="TEACHMi" width="142" height="38" />
        </h1>
        <p className={styles.tagline}>가르치다 보면, 진짜로 알게 돼요</p>
        <p className={styles.bubble}>오늘 배운 거, 저한테 설명해 줄래요?</p>
      </div>

      <div className={styles.actions}>
        <Button variant="kakao" onClick={showNotReady}>
          <img src={kakaoIcon} alt="" width="20" height="20" />
          카카오로 시작하기
        </Button>
        <Button variant="secondary" onClick={showNotReady}>
          <img src={googleIcon} alt="" width="20" height="20" />
          Google로 계속하기
        </Button>
        <Link className={styles.idLink} to="/login/id">
          아이디로 시작하기
        </Link>
        <p className={styles.terms}>
          시작하면 TEACHMi 이용약관과 개인정보 처리방침에 동의하게 돼요.
        </p>
      </div>

      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        아직 준비 중이에요. 아이디로 시작해 주세요.
      </Toast>
    </div>
  );
}
