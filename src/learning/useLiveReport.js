import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { confirmReport, relearn } from '../api/assessment';
import { messageFor } from '../api/errors';
import useLearningSession from './useLearningSession';
import useReport from './useReport';

export function useReportActions(sessionId, report) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function confirmIfNeeded() {
    if (report?.status === 'ready') await confirmReport(sessionId);
  }

  async function goHome() {
    setBusy(true);
    try {
      await confirmIfNeeded();
    } catch {
      setBusy(false);
    }
    navigate('/home');
  }

  async function explainAgain(problemId) {
    setError('');
    setBusy(true);
    try {
      await confirmIfNeeded();
      const result = await relearn(sessionId, problemId);
      navigate('/learn/mode', { state: { session: result.session } });
    } catch (err) {
      setBusy(false);
      setError(messageFor(err, '다시 시작하지 못했어요. 잠시 후 다시 시도해 주세요.'));
    }
  }

  return { busy, error, goHome, explainAgain };
}

export function useLiveReport() {
  const { state } = useLocation();
  const { session, loadError } = useLearningSession();
  const sessionId = state?.sessionId ?? session?.sessionId;
  const { report, error } = useReport(sessionId, state?.report ?? null);
  return { state, sessionId, report, error, noSession: !sessionId && Boolean(loadError) };
}
