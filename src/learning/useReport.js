import { useEffect, useState } from 'react';
import { getReport, publishReport } from '../api/assessment';

export default function useReport(sessionId, initial = null) {
  const [report, setReport] = useState(initial);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId || report) return undefined;
    let active = true;
    getReport(sessionId)
      .catch((err) => {
        if (err.code === 'REPORT_NOT_READY') return publishReport(sessionId);
        throw err;
      })
      .then((found) => active && setReport(found))
      .catch((err) => active && setError(err));
    return () => {
      active = false;
    };
  }, [sessionId, report]);

  return { report, setReport, error };
}
