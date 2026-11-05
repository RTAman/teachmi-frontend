import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { getMe, logout } from '../../api/auth';
import chevronIcon from '../../assets/icons/chevron-right.svg';
import { useAuth } from '../../auth/authContext';
import profileIcon from '../../assets/icons/profile.svg';
import AppShell from '../../components/AppShell/AppShell';
import BottomNav from '../../components/BottomNav/BottomNav';
import Button from '../../components/Button/Button';
import Dialog from '../../components/Dialog/Dialog';
import HomeBar from '../../components/HomeBar/HomeBar';
import Skeleton from '../../components/Skeleton/Skeleton';
import styles from './MyPage.module.css';

const MENUS = [
  { to: '/records', label: '나의 학습 기록' },
  { to: '/reports', label: '성장 리포트' },
];

export default function MyPage() {
  const navigate = useNavigate();
  const { setStatus } = useAuth();
  const [me, setMe] = useState({ status: 'loading' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [logoutFailed, setLogoutFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getMe()
      .then((data) => active && setMe({ status: data?.email ? 'done' : 'error', id: data?.email }))
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) setStatus('out');
        else setMe({ status: 'error' });
      });
    return () => {
      active = false;
    };
  }, [setStatus]);

  async function handleLogout() {
    setLeaving(true);
    setLogoutFailed(false);
    try {
      await logout();
      setStatus('out');
      navigate('/login', { replace: true });
    } catch {
      setLeaving(false);
      setLogoutFailed(true);
    }
  }

  return (
    <AppShell plainHeader header={<HomeBar />} footer={<BottomNav />}>
      <div className={styles.page}>
        <h1 className={styles.heading}>마이페이지</h1>

        <section className={styles.profile} aria-label="내 정보">
          <span className={styles.avatar}>
            <img src={profileIcon} alt="" width="28" height="28" />
          </span>
          <div className={styles.account}>
            <p className={styles.label}>아이디</p>
            {me.status === 'loading' && <Skeleton width={120} height={14} radius={7} />}
            {me.status === 'done' && <p className={styles.id}>{me.id}</p>}
            {me.status === 'error' && <p className={styles.error}>내 정보를 불러오지 못했어요</p>}
          </div>
        </section>

        <ul className={styles.menu}>
          {MENUS.map((menu) => (
            <li key={menu.to}>
              <Link to={menu.to}>
                {menu.label}
                <img src={chevronIcon} alt="" width="20" height="20" />
              </Link>
            </li>
          ))}
        </ul>

        <Button variant="secondary" size="md" onClick={() => setConfirmOpen(true)}>
          로그아웃
        </Button>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="로그아웃할까요?"
        actions={
          <>
            <Button size="md" variant="secondary" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
            <Button size="md" onClick={handleLogout} disabled={leaving}>
              로그아웃
            </Button>
          </>
        }
      >
        다시 들어오려면 아이디로 로그인해야 해요.
        {logoutFailed && (
          <span className={styles.dialogError} role="alert">
            로그아웃하지 못했어요. 잠시 후 다시 시도해 주세요.
          </span>
        )}
      </Dialog>
    </AppShell>
  );
}
