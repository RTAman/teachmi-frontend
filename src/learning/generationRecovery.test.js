import { describe, expect, it } from 'vitest';
import { ApiError } from '../api/client';
import { canRetrySame } from '../api/errors';
import { generationRecovery } from './generationRecovery';

describe('generation recovery rules', () => {
  it.each(['review_required', 'limit_reached', 'check_configuration', 'wait'])('blocks %s from a restored session', (action) => {
    const state = generationRecovery({ recovery: { action, retryAllowed: false } });
    expect(state.blocked).toBe(true);
    expect(state.message).not.toContain('답변은 저장');
  });
  it('honors legacy terminal codes without recovery or a matching HTTP status', () => {
    const error = new ApiError(502, 'INVALID_GEMINI_RESPONSE', '', {
      currentSession: { pendingTurn: { errorCode: 'AI_GENERATION_UNCERTAIN' } },
    });
    expect(generationRecovery(null, error)).toMatchObject({ blocked: true });
    expect(generationRecovery(null, error).message).toContain('지원 담당자');
    expect(generationRecovery(null, new ApiError(429, 'AI_ATTEMPT_LIMIT')).blocked).toBe(true);
  });
  it('shows a session reference after reload without exposing arbitrary values', () => {
    const id = 'e156ef85-d0cc-4ab3-8b9c-cff238ec4680';
    const recovery = { action: 'review_required', retryAllowed: false };
    expect(generationRecovery({ sessionId: id, recovery }).message).toContain(`학습 번호: ${id}`);
    expect(generationRecovery({ sessionId: 'untrusted-value', recovery }).message).not.toContain('untrusted-value');
  });
  it('requires a read-only status check for network and unclassified server failures', () => {
    for (const error of [new ApiError(0, 'NETWORK'), new ApiError(503)]) {
      expect(generationRecovery({}, error)).toMatchObject({ blocked: true });
      expect(generationRecovery({}, error).message).toContain('저장 상태');
    }
  });
  it('permits explicit retry_same_request only when allowed and never overrides a terminal code', () => {
    const retry = { recovery: { action: 'retry_same_request', retryAllowed: true } };
    expect(generationRecovery({}, new ApiError(502, 'INVALID_GEMINI_RESPONSE', '', retry)).blocked).toBe(false);
    const terminal = new ApiError(0, 'AI_GENERATION_UNCERTAIN', '', retry);
    expect(canRetrySame(terminal)).toBe(false);
    expect(generationRecovery({}, terminal).blocked).toBe(true);
  });
});
