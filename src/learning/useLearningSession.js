import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getActiveSession } from '../api/sessions';
import { useAuth } from '../auth/authContext';

export const STAGE_ROUTES = {
  mode: '/learn/mode',
  summary: '/learn/summary',
  chat: '/learn/chat',
  problem: '/learn/problem',
  report: '/learn/report',
};

export default function useLearningSession({ verifyOnMount = false } = {}) {
  const { status } = useAuth();
  const live = status === 'in';
  const { state } = useLocation();
  const [session, setSession] = useState(state?.session ?? null);
  const [loadError, setLoadError] = useState(null);
  const [verified, setVerified] = useState(false);
  const shouldLoad = live && (verifyOnMount || !session);

  useEffect(() => {
    if (!shouldLoad) return undefined;
    let active = true;
    getActiveSession()
      .then((found) => {
        if (!active) return;
        if (found) setSession(found);
        else setLoadError('none');
        setVerified(true);
      })
      .catch((error) => {
        if (active) { setLoadError(error); setVerified(true); }
      });
    return () => {
      active = false;
    };
  }, [shouldLoad]);

  async function refresh() {
    const found = await getActiveSession();
    setSession(found);
    setLoadError(found ? null : 'none');
    return found;
  }

  return { live, session, setSession, loadError, refresh,
    checking: live && verifyOnMount && !verified, subject: state?.subject };
}
