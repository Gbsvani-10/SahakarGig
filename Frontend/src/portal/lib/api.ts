import type { User, WorkerProfile, CustomerProfile } from '../types.ts';

const TOKEN_KEY = 'sahakargig_token';
const APP_TOKEN_KEY = 'sahakar_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(APP_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(APP_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(APP_TOKEN_KEY);
}

export const removeAuthToken = clearAuthToken;

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(endpoint, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed with status ${res.status}`);
  return data as T;
}

export const api = {
  registerWorker: (data: any) =>
    fetchApi<{ token: string; user: User; workerProfile: WorkerProfile }>('/api/auth/register-worker', {
      method: 'POST', body: JSON.stringify(data)
    }),
  registerCustomer: (data: any) =>
    fetchApi<{ token: string; user: User; customerProfile: CustomerProfile }>('/api/auth/register-customer', {
      method: 'POST', body: JSON.stringify(data)
    }),
  login: (data: { identifier: string; password: string; expectedRole?: string }) =>
    fetchApi<{ token: string; user: User; profile: WorkerProfile | CustomerProfile | null }>('/api/auth/login', {
      method: 'POST', body: JSON.stringify(data)
    }),
  getCurrentUser: () => fetchApi<{ user: User; profile: WorkerProfile | CustomerProfile | null }>('/api/auth/me'),
  logout: async () => {
    try { await fetchApi<{ success: boolean }>('/api/auth/logout', { method: 'POST' }); } finally { clearAuthToken(); }
  }
};
