import { Navigate, Outlet } from 'react-router';
import { useAuth } from './authContext';

export function RequireLogin() {
  const { status } = useAuth();
  if (status === 'checking') return null;
  if (status === 'out') return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function GuestOnly() {
  const { status } = useAuth();
  if (status === 'checking') return null;
  if (status === 'in') return <Navigate to="/home" replace />;
  return <Outlet />;
}
