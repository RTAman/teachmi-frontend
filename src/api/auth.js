import { request } from './client';

export function login(id, password) {
  return request('/auth/login', { method: 'POST', body: { email: id, password } });
}

export function signup(id, password) {
  return request('/auth/signup', { method: 'POST', body: { email: id, password } });
}
