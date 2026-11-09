import { useEffect, useRef } from 'react';
import { sendHesitation } from '../api/sessions';

const WAIT_SECONDS = 30;

export default function useHesitation(sessionId, targetMessageId) {
  const sentRef = useRef(new Set());

  useEffect(() => {
    if (!targetMessageId || sentRef.current.has(targetMessageId)) return undefined;
    const timer = setTimeout(() => {
      sentRef.current.add(targetMessageId);
      sendHesitation(sessionId, targetMessageId, WAIT_SECONDS).catch(() => {});
    }, WAIT_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [sessionId, targetMessageId]);
}
