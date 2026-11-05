import { useNavigate } from 'react-router';
import AppBar from '../components/AppBar/AppBar';
import AppShell from '../components/AppShell/AppShell';
import BottomNav from '../components/BottomNav/BottomNav';

// 아직 만들지 않은 화면의 임시 페이지입니다. 실제 화면을 만들면 App.jsx에서 교체합니다.
// showNav: 하단 메뉴 표시 여부
export default function PlaceholderPage({ title, showNav = true }) {
  const navigate = useNavigate();

  return (
    <AppShell
      header={<AppBar title={title} onBack={showNav ? undefined : () => navigate(-1)} />}
      footer={showNav ? <BottomNav /> : undefined}
    >
      <p>준비 중인 화면이에요.</p>
    </AppShell>
  );
}
