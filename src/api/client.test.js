import { afterEach, expect, it, vi } from 'vitest';
import { request } from './client';

afterEach(() => vi.unstubAllGlobals());

it('captures only a bounded UUID support header and never retries a 503', async () => {
  const requestId = '1860997b-fc79-4659-95cb-dc6913b903c1';
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ code: 'AI_GENERATION_UNCERTAIN' }), {
    status: 503, headers: { 'Content-Type': 'application/json', 'X-Teachmi-Request-Id': requestId },
  }));
  vi.stubGlobal('fetch', fetch);
  await expect(request('/sessions/test/mode', { method: 'PUT', body: { mode: 'first' }, idempotencyKey: 'same-key' }))
    .rejects.toMatchObject({ status: 503, requestId });
  expect(fetch).toHaveBeenCalledTimes(1);
  fetch.mockResolvedValueOnce(new Response('{}', { status: 503,
    headers: { 'Content-Type': 'application/json', 'X-Teachmi-Request-Id': 'untrusted-header' } }));
  await expect(request('/sessions/test')).rejects.toMatchObject({ requestId: null });
});
