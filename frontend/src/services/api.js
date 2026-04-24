const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const makeAuthHeader = (credential) => ({ Authorization: `Basic ${credential}` });

const ERROR_TRANSLATIONS = {
  'Username already exists': 'Tên đăng nhập đã tồn tại',
  'Email already exists': 'Email đã tồn tại',
  'Authentication required': 'Yêu cầu xác thực',
  'Invalid credentials': 'Thông tin đăng nhập không đúng',
  'Account is pending approval': 'Tài khoản đang chờ quản trị viên duyệt',
  'Account not approved': 'Tài khoản chưa được duyệt',
  'Request failed': 'Yêu cầu thất bại',
  'Forbidden': 'Bạn không có quyền thực hiện thao tác này',
  'Not found': 'Không tìm thấy dữ liệu',
  'Internal server error': 'Lỗi máy chủ, vui lòng thử lại',
};

function translateError(message) {
  return ERROR_TRANSLATIONS[message] || message;
}

async function request(path, { method = 'GET', credential, body, responseType = 'json' } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(credential ? makeAuthHeader(credential) : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(translateError(data.message || 'Request failed'));
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
