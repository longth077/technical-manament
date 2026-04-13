import { get, post } from './api';

export function getOverview() {
  return get('/api/overview');
}

export function saveOverview(data) {
  return post('/api/overview', data);
}
