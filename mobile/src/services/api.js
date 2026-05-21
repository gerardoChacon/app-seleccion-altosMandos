// In-memory token store (persists during app session)
let authToken = null;

export function setToken(token) { authToken = token; }
export function clearToken()    { authToken = null; }
export function getToken()      { return authToken; }

const BASE_URL = `http://${process.env.EXPO_PUBLIC_API_HOST ?? '192.168.3.55'}:8000/api`;

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const options = { method, headers };
  if (body !== null) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message ?? `HTTP ${res.status}`);
    err.status = res.status;
    err.errors = data.errors ?? {};
    throw err;
  }

  return data;
}

const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  put:    (path, body)   => request('PUT',    path, body),
  delete: (path)         => request('DELETE', path),
};

export default api;
