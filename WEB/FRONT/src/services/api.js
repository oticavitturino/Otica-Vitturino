const API_BASE = import.meta.env.VITE_API_URL ?? '';
const TOKEN_KEY = 'token';

let memoryToken = null;

export function getToken() {
  if (memoryToken) {
    return memoryToken;
  }
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  memoryToken = token;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.warn('Não foi possível salvar o token no localStorage:', error);
  }
}

export function clearToken() {
  memoryToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function hasToken() {
  const token = getToken();
  return typeof token === 'string' && token.length > 0;
}

export function getAuthHeaders(includeJson = true) {
  const headers = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch(path, options = {}) {
  const { auth = true, headers: customHeaders = {}, ...rest } = options;

  if (auth && !hasToken()) {
    console.warn(`Requisição autenticada sem token: ${path}`);
  }

  const headers = auth
    ? { ...getAuthHeaders(true), ...customHeaders }
    : { 'Content-Type': 'application/json', ...customHeaders };

  return fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
  });
}
