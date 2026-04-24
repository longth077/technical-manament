import { mapApiErrorMessage } from './errorMapper';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const makeAuthHeader = (credential) => ({ Authorization: `Basic ${credential}` });

async function request(path, { method = 'GET', credential, body, responseType = 'json' } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(credential ? makeAuthHeader(credential) : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error(mapApiErrorMessage(error.message));
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(mapApiErrorMessage(data.message || 'Request failed'));
  }

  if (responseType === 'blob') return res.blob();
  if (responseType === 'text') return res.text();
  return res.json();
}

export const Api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  me: (credential) => request('/auth/me', { credential }),

  listEntity: (entity, credential) => request(`/entities/${entity}`, { credential }),
  createEntity: (entity, payload, credential) => request(`/entities/${entity}`, { method: 'POST', credential, body: payload }),
  updateEntity: (entity, id, payload, credential) => request(`/entities/${entity}/${id}`, { method: 'PUT', credential, body: payload }),
  deleteEntity: (entity, id, credential) => request(`/entities/${entity}/${id}`, { method: 'DELETE', credential }),
  exportEntityExcel: (entity, credential) => request(`/reports/${entity}/excel`, { credential, responseType: 'blob' }),

  listUsers: (credential) => request('/admin/users', { credential }),
  listPendingUsers: (credential) => request('/admin/users/pending', { credential }),
  approveUser: (id, credential) => request(`/admin/users/${id}/approve`, { method: 'PATCH', credential }),
  updateUserRole: (id, role, credential) => request(`/admin/users/${id}/role`, { method: 'PATCH', credential, body: { role } }),
  deleteUser: (id, credential) => request(`/admin/users/${id}`, { method: 'DELETE', credential }),

  exportAllExcel: (credential) => request('/admin/export/excel', { credential, responseType: 'blob' }),
  importExcel: (base64, credential) => request('/admin/import/excel', { method: 'POST', credential, body: { base64 } }),
};
