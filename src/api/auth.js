import { request } from './client';

export function login(id, password) {
  return request('/auth/login', { method: 'POST', body: { email: id, password } });
}

export function signup(id, password) {
  return request('/auth/signup', { method: 'POST', body: { email: id, password } });
}

export function getMe() {
  return request('/auth/me');
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
}
