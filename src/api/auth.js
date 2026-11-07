import { request, setCsrfToken } from './client';

export async function login(email, password) {
  const result = await request('/auth/login', { method: 'POST', body: { email, password } });
  setCsrfToken(result?.csrfToken);
  return result;
}

export function signup(email, password) {
  return request('/auth/signup', { method: 'POST', body: { email, password } });
}

export async function getMe() {
  const me = await request('/auth/me');
  setCsrfToken(me?.csrfToken);
  return me;
}

export async function logout() {
  await request('/auth/logout', { method: 'POST' });
  setCsrfToken(null);
}
