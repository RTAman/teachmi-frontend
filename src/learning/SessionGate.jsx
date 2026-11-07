import { Navigate } from 'react-router';
import { messageFor } from '../api/errors';
import AppShell from '../components/AppShell/AppShell';
import Skeleton from '../components/Skeleton/Skeleton';
import styles from './SessionGate.module.css';

export default function SessionGate({ loadError, header }) {
  if (loadError === 'none') return <Navigate to="/learn" replace />;

  return (
    <AppShell header={header}>
      {loadError ? (
        <p className={styles.error} role="alert">
          {messageFor(loadError, '학습을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')}
        </p>
      ) : (
        <div className={styles.loading} aria-label="학습을 불러오는 중">
          <Skeleton width="60%" height={22} radius={6} />
          <Skeleton height={120} radius={20} />
          <Skeleton height={120} radius={20} />
        </div>
      )}
    </AppShell>
  );
}
