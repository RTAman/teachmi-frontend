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

export default function useLearningSession() {
  const { status } = useAuth();
  const live = status === 'in';
  const { state } = useLocation();
  const [session, setSession] = useState(state?.session ?? null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!live || session) return undefined;
    let active = true;
    getActiveSession()
      .then((found) => {
        if (!active) return;
        if (found) setSession(found);
        else setLoadError('none');
      })
      .catch((error) => active && setLoadError(error));
    return () => {
      active = false;
    };
  }, [live, session]);

  return { live, session, setSession, loadError, subject: state?.subject };
}
