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
