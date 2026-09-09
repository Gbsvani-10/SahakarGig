import { User, UserRole } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

function mapUser(data: any, identifier: string): User {
  const backendRole = data?.role;
  const role = (backendRole === 'coop_admin' ? 'admin' : backendRole) as UserRole;
  if (!data?.id || !data?.name || !role) throw new Error('Invalid user data returned by server');
  return {
    id: data.id,
    name: data.name,
    email: data.email || identifier,
    phone: data.phone || '',
    role,
    avatarUrl: data.avatar_url || data.avatarUrl,
    cooperativeId: data.cooperative_id,
    cooperativeName: data.cooperative_name,
    address: data.address,
    city: data.city,
    state: data.state,
    pincode: data.pincode,
    joinedDate: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : undefined
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

  async loginAs(_role: UserRole): Promise<AuthResponse> {
    throw new Error('Demo login is disabled. Please sign in with a registered SahakarGig account.');
  },

  async register(userData: Partial<User> & { password?: string }): Promise<AuthResponse> {
    const requestedRole = userData.role === 'worker' ? 'worker' : 'customer';
    if (requestedRole === 'worker') {
      throw new Error('Worker self-registration requires cooperative onboarding. Please use a worker onboarding flow.');
    }
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: requestedRole
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.user) throw new Error(data.error || `Registration failed (${res.status})`);
    return this.login(String(userData.email), String(userData.password), requestedRole);
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
