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

const FORM_ID = 'signup-form';

function getErrorMessage(status) {
  if (status === 409) return '이미 사용 중인 아이디예요.';
  if (status === 422) return '입력한 내용을 다시 확인해 주세요.';
  return '가입하지 못했어요. 잠시 후 다시 시도해 주세요.';
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordMismatch = passwordConfirm !== '' && password !== passwordConfirm;
  const canSubmit =
    id.trim() !== '' && password !== '' && password === passwordConfirm && !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setError('');
    setSubmitting(true);
    try {
      await signup(id.trim(), password);
      navigate('/login/id', { replace: true, state: { signedUp: true } });
    } catch (err) {
      setError(getErrorMessage(err.status));
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      header={<AppBar title="회원가입" onBack={() => navigate('/login/id')} />}
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
          label="아이디"
          required
          autoComplete="username"
          placeholder="아이디를 입력해 주세요"
          value={id}
          onChange={(event) => setId(event.target.value)}
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
        이미 계정이 있나요? <Link to="/login/id">로그인</Link>
      </p>
    </AppShell>
  );
}
