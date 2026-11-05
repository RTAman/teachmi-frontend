import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { login } from '../../api/auth';
import { useAuth } from '../../auth/authContext';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import InlineError from '../../components/InlineError/InlineError';
import TextField from '../../components/TextField/TextField';
import Toast from '../../components/Toast/Toast';
import styles from './AuthForm.module.css';
import { EMAIL_ERROR, isEmail } from './email';

const FORM_ID = 'login-form';

function getErrorMessage(status) {
  if (status === 401) return '이메일 또는 비밀번호가 맞지 않아요.';
  if (status === 429) return '로그인 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.';
  return '로그인하지 못했어요. 잠시 후 다시 시도해 주세요.';
}

export default function LoginFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setStatus } = useAuth();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signedUp, setSignedUp] = useState(Boolean(location.state?.signedUp));

  const emailInvalid = emailTouched && email.trim() !== '' && !isEmail(email);
  const canSubmit = isEmail(email) && password !== '' && !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      setStatus('in');
      navigate('/home', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err.status));
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      header={<AppBar title="로그인" onBack={() => navigate('/login')} />}
      footer={
        <BottomCTA>
          <Button type="submit" form={FORM_ID} disabled={!canSubmit}>
            {submitting ? '로그인 중...' : '로그인'}
          </Button>
        </BottomCTA>
      }
    >
      <form id={FORM_ID} className={styles.form} onSubmit={handleSubmit}>
        <TextField
          label="이메일"
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setEmailTouched(true)}
          error={emailInvalid ? EMAIL_ERROR : undefined}
        />
        <TextField
          label="비밀번호"
          required
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <InlineError>{error}</InlineError>}
      </form>

      <p className={styles.switchText}>
        아직 계정이 없나요? <Link to="/signup">회원가입</Link>
      </p>

      <Toast open={signedUp} onClose={() => setSignedUp(false)}>
        가입이 완료됐어요. 로그인해 주세요.
      </Toast>
    </AppShell>
  );
}
