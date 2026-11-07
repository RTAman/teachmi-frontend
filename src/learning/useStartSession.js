import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { newKey } from '../api/client';
import { messageFor } from '../api/errors';
import { createSession } from '../api/sessions';
import { STAGE_ROUTES } from './useLearningSession';

export default function useStartSession() {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(null);
  const keyRef = useRef(null);

  function goTo(session, subject) {
    navigate(STAGE_ROUTES[session.stage] ?? STAGE_ROUTES.mode, { state: { session, subject } });
  }

  async function start({ materialId, conceptId, subject, replace }) {
    setError('');
    setStarting(true);
    if (!keyRef.current) keyRef.current = newKey();
    try {
      const session = await createSession(
        replace
          ? { materialId, conceptId, replaceSessionId: replace.sessionId, expectedVersion: replace.version }
          : { materialId, conceptId },
        keyRef.current,
      );
      keyRef.current = null;
      setConflict(null);
      goTo(session, subject);
    } catch (err) {
      if (err.status !== 0) keyRef.current = null;
      setStarting(false);
      if (err.code === 'ACTIVE_SESSION_EXISTS' && err.body?.currentSession) {
        setConflict({ materialId, conceptId, subject, current: err.body.currentSession });
      } else {
        setError(messageFor(err, '학습을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.'));
      }
    }
  }

  return {
    starting,
    error,
    conflict,
    start,
    replace: () => conflict && start({ ...conflict, replace: conflict.current }),
    resume: () => conflict && goTo(conflict.current, conflict.subject),
    dismiss: () => setConflict(null),
  };
}
