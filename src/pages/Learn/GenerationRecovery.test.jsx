import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../api/client';
import { chooseMode, getActiveSession, startChat } from '../../api/sessions';
import ModePage from './ModePage';
import SummaryPage from './SummaryPage';

vi.mock('../../auth/authContext', () => ({ useAuth: () => ({ status: 'in' }) }));
vi.mock('../../api/sessions', () => ({ chooseMode: vi.fn(), getActiveSession: vi.fn(), startChat: vi.fn() }));

const sessionId = 'e156ef85-d0cc-4ab3-8b9c-cff238ec4680';
const reference = '1860997b-fc79-4659-95cb-dc6913b903c1';
function session(stage = 'mode', recovery) {
  return { sessionId, stage, status: 'active', version: stage === 'mode' ? 0 : 1,
    concept: { name: '합성 테스트 개념' }, summary: { text: '합성 요약', examples: [], keyTerms: [] },
    availableActions: recovery ? ['wait'] : [stage === 'mode' ? 'select_mode' : 'start_chat'], recovery };
}
function mount(stage = 'mode') {
  return render(<MemoryRouter initialEntries={[{ pathname: `/learn/${stage}`, state: { session: session(stage) } }]}>
    <Routes>
      <Route path="/learn/mode" element={<ModePage />} />
      <Route path="/learn/summary" element={<SummaryPage />} />
      <Route path="/learn/chat" element={<div>대화 화면</div>} />
    </Routes>
  </MemoryRouter>);
}
async function startMode() {
  fireEvent.click(await screen.findByRole('radio', { name: /처음 학습해요/ }));
  return screen.getByRole('button', { name: '처음 학습 시작하기' });
}
function terminal(code = 'AI_GENERATION_UNCERTAIN') {
  return new ApiError(code === 'AI_ATTEMPT_LIMIT' ? 429 : 503, code, '', {
    recovery: { action: code === 'AI_ATTEMPT_LIMIT' ? 'limit_reached' : 'review_required', retryAllowed: false },
  }, reference);
}

beforeEach(() => { vi.resetAllMocks(); getActiveSession.mockResolvedValue(session()); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('mode selection safety', () => {
  it.each(['AI_GENERATION_UNCERTAIN', 'AI_ATTEMPT_LIMIT'])('locks the start button and radios after %s without another generation', async (code) => {
    chooseMode.mockRejectedValue(terminal(code));
    mount();
    fireEvent.click(await startMode());
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', expect.stringContaining(reference));
    expect(screen.getByRole('alert').textContent).not.toContain('답변은 저장');
    expect(screen.getByRole('button', { name: '처음 학습 시작하기' }).disabled).toBe(true);
    expect(screen.getAllByRole('radio').every((radio) => radio.disabled)).toBe(true);
    expect(screen.getByRole('button', { name: '변경' }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '처음 학습 시작하기' }));
    fireEvent.click(screen.getByRole('button', { name: '저장 상태 확인' }));
    await waitFor(() => expect(getActiveSession).toHaveBeenCalledTimes(2));
    expect(chooseMode).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '처음 학습 시작하기' }).disabled).toBe(true);
  });

  it('checks the server before using a stale router snapshot and restores a terminal lock', async () => {
    let resolve;
    getActiveSession.mockReturnValue(new Promise((done) => { resolve = done; }));
    mount();
    expect(screen.queryByRole('radio')).toBeNull();
    await act(async () => resolve(session('mode', { action: 'review_required', retryAllowed: false })));
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('button', { name: '학습 시작하기' }).disabled).toBe(true);
    expect(chooseMode).not.toHaveBeenCalled();
  });

  it('uses a synchronous guard to send only one request during a rapid double click', async () => {
    let resolve;
    chooseMode.mockReturnValue(new Promise((done) => { resolve = done; }));
    mount();
    const button = await startMode();
    act(() => { fireEvent.click(button); fireEvent.click(button); });
    expect(chooseMode).toHaveBeenCalledTimes(1);
    await act(async () => resolve(session('summary')));
    await waitFor(() => expect(screen.queryByText('요약을 만들고 있어요...')).toBeNull());
  });

  it('checks saved status with GET after an ambiguous network failure and retains the original key', async () => {
    chooseMode.mockRejectedValueOnce(new ApiError(0, 'NETWORK')).mockResolvedValueOnce(session('summary'));
    mount();
    fireEvent.click(await startMode());
    await screen.findByRole('alert');
    expect(screen.getByRole('button', { name: '처음 학습 시작하기' }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '저장 상태 확인' }));
    await waitFor(() => expect(screen.getByRole('button', { name: '처음 학습 시작하기' }).disabled).toBe(false));
    fireEvent.click(screen.getByRole('button', { name: '처음 학습 시작하기' }));
    await waitFor(() => expect(chooseMode).toHaveBeenCalledTimes(2));
    expect(chooseMode.mock.calls[1]).toEqual(chooseMode.mock.calls[0]);
  });

  it('does not poll or post automatically while waiting', async () => {
    getActiveSession.mockResolvedValue(session('mode', { action: 'wait', retryAllowed: false }));
    mount();
    await screen.findByRole('alert');
    vi.useFakeTimers();
    await act(async () => vi.advanceTimersByTime(120000));
    expect(getActiveSession).toHaveBeenCalledTimes(1);
    expect(chooseMode).not.toHaveBeenCalled();
  });
});

describe('summary preparation safety', () => {
  it('locks first-question generation after uncertain and does not claim a learner answer was saved', async () => {
    getActiveSession.mockResolvedValue(session('summary'));
    startChat.mockRejectedValue(terminal());
    mount('summary');
    fireEvent.click(await screen.findByRole('button', { name: 'AI 학생에게 설명하러 가기' }));
    expect((await screen.findByRole('alert')).textContent).toContain(reference);
    expect(screen.getByRole('alert').textContent).not.toContain('답변은 저장');
    expect(screen.getByRole('button', { name: 'AI 학생에게 설명하러 가기' }).disabled).toBe(true);
    expect(startChat).toHaveBeenCalledTimes(1);
  });
});
