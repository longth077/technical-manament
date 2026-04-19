import { get, post, put, del } from './api';

const BASE = '/api/warehouses';

export function getAll() {
  return get(BASE);
}

export function getById(id) {
  return get(`${BASE}/${id}`);
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

// --- Sub-resource helpers ---

function subResource(warehouseId, resource) {
  return `${BASE}/${warehouseId}/${resource}`;
}

function makeSub(resource) {
  return {
    getAll: (wId) => get(subResource(wId, resource)),
    add: (wId, data) => post(subResource(wId, resource), data),
    update: (wId, id, data) => put(`${subResource(wId, resource)}/${id}`, data),
    remove: (wId, id) => del(`${subResource(wId, resource)}/${id}`),
  };
}

export const equipment = makeSub('equipment');
export const inspections = makeSub('inspections');
export const access = makeSub('access');
export const handover = makeSub('handover');
export const exports_ = makeSub('exports');
export const imports_ = makeSub('imports');
export const lightning = makeSub('lightning');
