// Base API Client abstraction ready for real backend or mock mode
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export async function simulatedLatency<T>(data: T, delayMs: number = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
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

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data as ApiResponse<T>;
  } catch (err: any) {
    // Graceful fallback for mock mode
    console.warn(`[ApiClient] Live API call to ${endpoint} failed, relying on mock service:`, err.message);
    throw err;
  }
}
