import { get, post, put, del } from './api';

const BASE = '/api/tech-equipment';

export function getAll() {
  return get(BASE);
}

export function create(data) {
  return post(BASE, data);
}

export function update(id, data) {
  return put(`${BASE}/${id}`, data);
}

export function remove(id) {
  return del(`${BASE}/${id}`);
}
