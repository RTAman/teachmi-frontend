import { useNavigate } from 'react-router';
import AppBar from '../components/AppBar/AppBar';
import AppShell from '../components/AppShell/AppShell';
import BottomNav from '../components/BottomNav/BottomNav';

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
