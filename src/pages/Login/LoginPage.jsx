import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { loginAsGuest } from '../../api/auth';
import brandSymbol from '../../assets/brand/brand-symbol.svg';
import wordmark from '../../assets/brand/wordmark.svg';
import googleIcon from '../../assets/icons/google.svg';
import kakaoIcon from '../../assets/icons/kakao.svg';
import { useAuth } from '../../auth/authContext';
import Button from '../../components/Button/Button';
import Toast from '../../components/Toast/Toast';
import styles from './LoginPage.module.css';

const NOT_READY = '아직 준비 중이에요. 이메일로 시작해 주세요.';

function guestErrorMessage(error) {
  if (error.status === 429) return '체험 접속이 많아요. 잠시 후 다시 시도하거나 회원가입해 주세요.';
  if (error.status === 404) return '지금은 게스트로 시작할 수 없어요. 회원가입 후 이용해 주세요.';
  if (error.status === 0) return '시작하지 못했어요. 인터넷 연결을 확인해 주세요.';
  return '시작하지 못했어요. 잠시 후 다시 시도해 주세요.';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setStatus } = useAuth();
  const [toast, setToast] = useState('');
  const [starting, setStarting] = useState(false);
  const showNotReady = () => setToast(NOT_READY);

  async function startAsGuest() {
    setStarting(true);
    try {
      await loginAsGuest();
      setStatus('in');
      navigate('/home', { replace: true });
    } catch (error) {
      setToast(guestErrorMessage(error));
      setStarting(false);
    }
  }

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
        <div className={styles.textLinks}>
          <Link className={styles.idLink} to="/login/email">
            이메일로 시작하기
          </Link>
          <span className={styles.divider} aria-hidden="true" />
          <button type="button" className={styles.idLink} onClick={startAsGuest} disabled={starting}>
            {starting ? '시작하는 중...' : '게스트로 시작하기'}
          </button>
        </div>
        <p className={styles.terms}>
          시작하면 TEACHMi 이용약관과 개인정보 처리방침에 동의하게 돼요.
        </p>
      </div>

      <Toast open={toast !== ''} onClose={() => setToast('')}>
        {toast}
      </Toast>
    </div>
  );
}
