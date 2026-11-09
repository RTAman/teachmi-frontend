import { newKey, request } from './client';

export function createSession({ materialId, conceptId, replaceSessionId, expectedVersion }, idempotencyKey = newKey()) {
  const body = { materialId, conceptId };
  if (replaceSessionId) Object.assign(body, { replaceSessionId, expectedVersion });
  return request('/sessions', { method: 'POST', body, idempotencyKey });
}

export function getActiveSession() {
  return request('/sessions/active');
}

export function getSession(sessionId) {
  return request(`/sessions/${sessionId}`);
}

export function chooseMode(sessionId, mode, expectedVersion, idempotencyKey = newKey()) {
  return request(`/sessions/${sessionId}/mode`, {
    method: 'PUT',
    body: { mode, expectedVersion },
    idempotencyKey,
  });
}

export function startChat(sessionId, expectedVersion, idempotencyKey = newKey()) {
  return request(`/sessions/${sessionId}/chat/start`, {
    method: 'POST',
    body: { expectedVersion },
    idempotencyKey,
  });
}

export function sendTurn(sessionId, { kind, text, expectedVersion }, idempotencyKey = newKey()) {
  const body = kind === 'answer' ? { kind, text, expectedVersion } : { kind, expectedVersion };
  return request(`/sessions/${sessionId}/turns`, { method: 'POST', body, idempotencyKey });
}

export function finishExplanation(sessionId, expectedVersion, idempotencyKey = newKey()) {
  return request(`/sessions/${sessionId}/explanation/finish`, {
    method: 'POST',
    body: { expectedVersion },
    idempotencyKey,
  });
}

export function sendHesitation(sessionId, targetMessageId, waitedSeconds) {
  return request(`/sessions/${sessionId}/hesitations`, {
    method: 'POST',
    body: { targetMessageId, waitedSeconds },
  });
}
