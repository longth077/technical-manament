import { post, get } from './api';

export function signin(username, password) {
  return post('/api/auth/signin', { username, password });
}

export function signup(data) {
  return post('/api/auth/signup', data);
}

export function logout() {
  return post('/api/auth/logout');
}

export function getProfile() {
  return get('/api/auth/me');
}
