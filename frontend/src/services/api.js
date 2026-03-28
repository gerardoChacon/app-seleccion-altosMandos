const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message ?? 'Error en la solicitud');
    err.status = res.status;
    err.errors = data.errors ?? null;
    throw err;
  }

  return data;
}

async function uploadForm(path, formData) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Error al subir archivo');
  return data;
}

const api = {
  get:        (path)        => request(path, { method: 'GET' }),
  post:       (path, body)  => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:        (path, body)  => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete:     (path)        => request(path, { method: 'DELETE' }),
  postForm:   (path, form)  => uploadForm(path, form),
};

export default api;
