import { get, post, put, del } from './api';

export function getAll() {
  return get('/api/staff');
}

export function getById(id) {
  return get(`/api/staff/${id}`);
}

export function create(data) {
  return post('/api/staff', data);
}

export function update(id, data) {
  return put(`/api/staff/${id}`, data);
}

export function remove(id) {
  return del(`/api/staff/${id}`);
}
