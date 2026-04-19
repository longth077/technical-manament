import { get, put } from './api';

export function getUnitInfo() {
  return get('/api/unit-info');
}

export function saveUnitInfo(data) {
  return put('/api/unit-info', data);
}
