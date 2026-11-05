import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { signup } from '../../api/auth';
import AppBar from '../../components/AppBar/AppBar';
import AppShell from '../../components/AppShell/AppShell';
import BottomCTA from '../../components/BottomCTA/BottomCTA';
import Button from '../../components/Button/Button';
import InlineError from '../../components/InlineError/InlineError';
import TextField from '../../components/TextField/TextField';
import styles from './AuthForm.module.css';
import { EMAIL_ERROR, isEmail } from './email';

const FORM_ID = 'signup-form';

function getErrorMessage(status) {
  if (status === 409) return '이미 가입된 이메일이에요.';
  if (status === 422) return '입력한 내용을 다시 확인해 주세요.';
  return '가입하지 못했어요. 잠시 후 다시 시도해 주세요.';
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordMismatch = passwordConfirm !== '' && password !== passwordConfirm;
  const emailInvalid = emailTouched && email.trim() !== '' && !isEmail(email);
  const canSubmit =
    isEmail(email) && password !== '' && password === passwordConfirm && !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setError('');
    setSubmitting(true);
    try {
      await signup(email.trim(), password);
      navigate('/login/email', { replace: true, state: { signedUp: true } });
    } catch (err) {
      setError(getErrorMessage(err.status));
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      header={<AppBar title="회원가입" onBack={() => navigate('/login/email')} />}
      footer={
        <BottomCTA>
          <Button type="submit" form={FORM_ID} disabled={!canSubmit}>
            {submitting ? '가입 중...' : '가입하기'}
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
          autoComplete="new-password"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          label="비밀번호 확인"
          required
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          error={passwordMismatch ? '비밀번호가 일치하지 않아요.' : undefined}
        />
        {error && <InlineError>{error}</InlineError>}
      </form>

      <p className={styles.switchText}>
        이미 계정이 있나요? <Link to="/login/email">로그인</Link>
      </p>
    </AppShell>
  );
}
