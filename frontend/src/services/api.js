async function request(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    let data = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    }

    if (!res.ok) {
      const message =
        (data && (data.message || data.error)) ||
        `Request failed with status ${res.status}`;
      return { data: null, error: message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error' };
  }
}

export function get(url) {
  return request(url, { method: 'GET' });
}

export function post(url, data) {
  return request(url, { method: 'POST', body: JSON.stringify(data) });
}

export function put(url, data) {
  return request(url, { method: 'PUT', body: JSON.stringify(data) });
}

export function del(url) {
  return request(url, { method: 'DELETE' });
}

export async function downloadFile(url, defaultFilename = 'download.xlsx') {
  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      let errMsg = `Download failed with status ${res.status}`;
      try {
        const errData = await res.json();
        errMsg = errData.message || errMsg;
      } catch { /* ignore */ }
      return { error: errMsg };
    }
    const blob = await res.blob();
    const disposition = res.headers.get('content-disposition');
    let filename = defaultFilename;
    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    return { error: null };
  } catch (err) {
    return { error: err.message || 'Download error' };
  }
}

export async function uploadFile(url, file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    let data = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    }
    if (!res.ok) {
      const message = (data && (data.message || data.error)) || `Upload failed with status ${res.status}`;
      return { data: null, error: message };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Upload error' };
  }
}
