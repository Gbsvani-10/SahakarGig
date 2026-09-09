// Shared API client for the live SahakarGig backend.
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('sahakar_auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  let responseBody: unknown;
  try {
    responseBody = await res.json();
  } catch {
    responseBody = undefined;
  }

  if (!res.ok) {
    const message =
      typeof responseBody === 'object' && responseBody !== null && 'error' in responseBody
        ? String((responseBody as { error?: unknown }).error)
        : `API Error ${res.status}: ${res.statusText}`;
    throw new Error(message);
  }

  return responseBody as ApiResponse<T>;
}
