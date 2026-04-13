import { get, post } from './api';

export function getUnitInfo() {
  return get('/api/unit-info');
}

export function saveUnitInfo(data) {
  return post('/api/unit-info', data);
}
