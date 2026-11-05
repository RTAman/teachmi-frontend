import AppShell from '../components/AppShell/AppShell';
import BottomNav from '../components/BottomNav/BottomNav';
import HomeBar from '../components/HomeBar/HomeBar';

export default function PlaceholderPage({ title, showNav = true }) {
  return (
    <AppShell plainHeader header={<HomeBar />} footer={showNav ? <BottomNav /> : undefined}>
      <h1>{title}</h1>
      <p>준비 중인 화면이에요.</p>
    </AppShell>
  );
}
