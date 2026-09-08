import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

export interface AuthResponse {
  user: User;
  token: string;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

function mapUser(data: any, identifier: string): User {
  const backendRole = data?.role;
  const role = (backendRole === 'coop_admin' ? 'admin' : backendRole) as UserRole;
  const fallback = MOCK_USERS[role] || MOCK_USERS.customer;
  return {
    id: data.id,
    name: data.name,
    email: data.email || identifier,
    phone: data.phone || fallback.phone,
    role,
    avatarUrl: fallback.avatarUrl,
    city: fallback.city,
    state: fallback.state,
    joinedDate: new Date().toISOString().split('T')[0]
  };
}

export const authService = {
  async login(identifier: string, pass: string, _requestedRole?: UserRole): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier.trim(), password: pass })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.token || !data.user) {
      throw new Error(data.error || `Login failed (${res.status})`);
    }
    return { user: mapUser(data.user, identifier), token: data.token };
  },

  async loginAs(role: UserRole): Promise<AuthResponse> {
    const demoCredentials: Record<string, { email: string; password: string }> = {
      customer: { email: 'demo.customer@sahakargig.local', password: 'Demo@123' },
      worker: { email: 'ravi.worker@sahakargig.local', password: 'Demo@123' },
      admin: { email: 'demo.admin@sahakargig.local', password: 'Demo@123' }
    };
    const credentials = demoCredentials[role] || demoCredentials.customer;
    return this.login(credentials.email, credentials.password, role);
  },

  async register(userData: Partial<User> & { password?: string }): Promise<AuthResponse> {
    const requestedRole = userData.role === 'admin' ? 'coop_admin' : (userData.role || 'customer');
    if (requestedRole === 'worker') {
      throw new Error('Worker self-registration requires cooperative onboarding. Please use a worker onboarding flow.');
    }
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name || 'New Sahakar Member',
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: requestedRole
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.user) throw new Error(data.error || `Registration failed (${res.status})`);
    return this.login(String(userData.email), String(userData.password), userData.role);
  },

  async getCurrentUser(token: string): Promise<User | null> {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (!payload?.id || !payload?.role) return null;
      return mapUser(payload, payload.email || '');
    } catch {
      return null;
    }
  }
};
