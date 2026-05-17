import { mapApiErrorMessage } from "./errorMapper";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const makeAuthHeader = (credential) => ({
  Authorization: `Basic ${credential}`,
});
async function request(
  path,
  { method = "GET", credential, body, responseType = "json" } = {},
) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(credential ? makeAuthHeader(credential) : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error(mapApiErrorMessage(error.message));
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(mapApiErrorMessage(data.message || "Request failed"));
  }

  if (responseType === "blob") return res.blob();
  if (responseType === "text") return res.text();
  return res.json();
}

export const Api = {
  signup: (payload) =>
    request("/auth/signup", { method: "POST", body: payload }),
  me: (credential) => request("/auth/me", { credential }),
  changePassword: (payload, credential) =>
    request("/auth/change-password", {
      method: "POST",
      credential,
      body: payload,
    }),

  listEntity: (entity, credential, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const path = qs ? `/entities/${entity}?${qs}` : `/entities/${entity}`;
    return request(path, { credential });
  },
  createEntity: (entity, payload, credential) =>
    request(`/entities/${entity}`, {
      method: "POST",
      credential,
      body: payload,
    }),
  updateEntity: (entity, id, payload, credential) =>
    request(`/entities/${entity}/${id}`, {
      method: "PUT",
      credential,
      body: payload,
    }),
  deleteEntity: (entity, id, credential) =>
    request(`/entities/${entity}/${id}`, { method: "DELETE", credential }),
  exportEntityExcel: (entity, credential, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const path = qs
      ? `/reports/${entity}/excel?${qs}`
      : `/reports/${entity}/excel`;
    return request(path, { credential, responseType: "blob" });
  },
  exportAllReports: (credential) =>
    request("/admin/reports/excel", { credential, responseType: "blob" }),

  listEnumByType: (type, credential) =>
    request(`/enums/${type}?limit=500`, { credential }),
  addEnumValue: (type, value, credential) =>
    request(`/enums/${type}`, {
      method: "POST",
      credential,
      body: { enum: value },
    }),

  listUsers: (credential) => request("/admin/users", { credential }),
  listPendingUsers: (credential) =>
    request("/admin/users/pending", { credential }),
  approveUser: (id, credential) =>
    request(`/admin/users/${id}/approve`, { method: "PATCH", credential }),
  updateUserRole: (id, role, credential) =>
    request(`/admin/users/${id}/role`, {
      method: "PATCH",
      credential,
      body: { role },
    }),
  deleteUser: (id, credential) =>
    request(`/admin/users/${id}`, { method: "DELETE", credential }),

  exportAllExcel: (credential) =>
    request("/admin/export/excel", { credential, responseType: "blob" }),
  exportAllSql: (credential) =>
    request("/admin/export/sql", { credential, responseType: "blob" }),
  exportAllCsv: (credential) =>
    request("/admin/export/csv", { credential, responseType: "blob" }),
  importExcel: (base64, credential) =>
    request("/admin/import/excel", {
      method: "POST",
      credential,
      body: { base64 },
    }),
  importCsv: (base64, credential) =>
    request("/admin/import/csv", {
      method: "POST",
      credential,
      body: { base64 },
    }),

  // ── Warehouse image upload (multipart) & delete (with file cleanup) ────────
  uploadWarehouseImage: (
    warehouseId,
    file,
    fileTypeId,
    description,
    credential,
  ) => {
    const form = new FormData();
    form.append("file", file);
    form.append("warehouse_id", String(warehouseId));
    if (fileTypeId) form.append("file_type_id", String(fileTypeId));
    if (description) form.append("description", description);
    return fetch(`${API_URL}/warehouse-images/upload`, {
      method: "POST",
      headers: { ...(credential ? makeAuthHeader(credential) : {}) },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(mapApiErrorMessage(data.message || "Upload thất bại"));
      }
      return res.json();
    });
  },

  deleteWarehouseImage: (id, credential) =>
    request(`/warehouse-images/${id}`, { method: "DELETE", credential }),
};
