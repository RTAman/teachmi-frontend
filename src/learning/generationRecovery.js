import { messageFor, terminalMessage } from '../api/errors.js';

// Preparation pages have no saved learner answer yet. Do not promise one or retry a generation automatically.
export function generationRecovery(session, error) {
  const current = error?.body?.currentSession ?? session;
  const recovery = error?.body?.recovery ?? current?.recovery;
  const codes = [error?.code, current?.pendingTurn?.errorCode, current?.activeReteach?.errorCode];
  const withSession = (message) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(current?.sessionId ?? '')
    ? `${message} 학습 번호: ${current.sessionId}` : message;
  const terminalCode = codes.find((code) => code === 'AI_GENERATION_UNCERTAIN') ?? codes.find((code) => code === 'AI_ATTEMPT_LIMIT');
  const terminal = terminalMessage({ code: terminalCode, recovery });
  if (terminal) {
    return { blocked: true, message: withSession(error ? messageFor({ ...error, code: terminalCode ?? error.code, status: error.status,
      requestId: error.requestId, body: { ...error.body, recovery } }, terminal) : terminal) };
  }
  if (recovery?.action === 'wait' || codes.includes('AI_GENERATION_IN_PROGRESS') || codes.includes('TURN_IN_PROGRESS') || current?.availableActions?.includes('wait')) {
    return { blocked: true, message: withSession('AI 생성이 아직 처리 중이거나 확인 대기 상태예요. 다시 시작하지 말고 저장 상태를 확인해 주세요.') };
  }
  if (error && (error.status === 0 || error.status >= 500) && recovery?.retryAllowed !== true) {
    return { blocked: true, message: withSession('요청 결과를 확인하지 못했어요. 다시 시작하기 전에 저장 상태를 확인해 주세요.') };
  }
  return { blocked: false, message: error ? messageFor(error) : '' };
}
