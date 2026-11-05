import { request } from './client';

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function signup(email, password) {
  return request('/auth/signup', { method: 'POST', body: { email, password } });
}

export function getMe() {
  return request('/auth/me');
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
}
