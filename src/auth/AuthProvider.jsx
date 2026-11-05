import { useEffect, useMemo, useState } from 'react';
import { getMe } from '../api/auth';
import { AuthContext } from './authContext';

export default function AuthProvider({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;
    getMe()
      .then((data) => active && setStatus(data?.email ? 'in' : 'unknown'))
      .catch((error) => active && setStatus(error.status === 401 ? 'out' : 'unknown'));
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ status, setStatus }), [status]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
