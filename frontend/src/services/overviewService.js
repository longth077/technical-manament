import { get, put } from './api';

export function getOverview() {
  return get('/api/overview');
}

export function saveOverview(data) {
  return put('/api/overview', data);
}
