import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { simulatedLatency } from './apiClient';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(identifier: string, pass: string, requestedRole?: UserRole): Promise<AuthResponse> {
    // 1. Try real backend API authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password: pass })
      });
      if (res.ok) {
        const data = await res.json();
        const role = (data.user.role === 'coop_admin' ? 'admin' : data.user.role) as UserRole;
        const mockFallback = MOCK_USERS[role] || MOCK_USERS.customer;
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email || identifier,
          phone: data.user.phone || mockFallback.phone,
          role: role,
          avatarUrl: mockFallback.avatarUrl,
          city: mockFallback.city,
          state: mockFallback.state,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        return { user, token: data.token };
      }
    } catch (err) {
      console.warn('[authService] Live /api/auth/login call fell back to local demo auth:', err);
    }

    // 2. Fallback to demo role or quick-switch
    let user: User;
    if (requestedRole && MOCK_USERS[requestedRole]) {
      user = MOCK_USERS[requestedRole];
    } else if (identifier.includes('worker') || identifier.includes('ravi')) {
      user = MOCK_USERS.worker;
    } else if (identifier.includes('admin') || identifier.includes('gov')) {
      user = MOCK_USERS.admin;
    } else {
      user = MOCK_USERS.customer;
    }

    const token = `jwt-demo-${user.role}-${Date.now()}`;
    return simulatedLatency({ user, token }, 200);
  },

  async loginAs(role: UserRole): Promise<AuthResponse> {
    const user = MOCK_USERS[role] || MOCK_USERS.customer;
    const token = `jwt-demo-${user.role}-${Date.now()}`;
    return simulatedLatency({ user, token }, 100);
  },

  async register(userData: Partial<User> & { password?: string }): Promise<AuthResponse> {
    // 1. Try real backend API registration
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name || 'New Sahakar Member',
          email: userData.email,
          password: userData.password || 'demo1234',
          phone: userData.phone || '+91 98000 00000',
          role: userData.role === 'admin' ? 'coop_admin' : (userData.role || 'customer')
        })
      });
      if (res.ok) {
        const data = await res.json();
        const role = (data.user.role === 'coop_admin' ? 'admin' : data.user.role) as UserRole;
        const mockFallback = MOCK_USERS[role] || MOCK_USERS.customer;
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: userData.phone || mockFallback.phone,
          role: role,
          avatarUrl: mockFallback.avatarUrl,
          city: userData.city || mockFallback.city,
          state: userData.state || mockFallback.state,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        const token = `jwt-demo-${role}-${Date.now()}`;
        return { user, token };
      }
    } catch (err) {
      console.warn('[authService] Live /api/auth/register fell back to local store:', err);
    }

    // 2. Fallback
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New Sahakar Member',
      email: userData.email || 'user@example.com',
      phone: userData.phone || '+91 98000 00000',
      role: userData.role || 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      city: userData.city || 'New Delhi',
      state: userData.state || 'Delhi',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const token = `jwt-demo-${newUser.role}-${Date.now()}`;
    return simulatedLatency({ user: newUser, token }, 250);
  },

  async getCurrentUser(token: string): Promise<User | null> {
    if (!token) return null;
    if (token.includes('worker')) return simulatedLatency(MOCK_USERS.worker, 100);
    if (token.includes('admin')) return simulatedLatency(MOCK_USERS.admin, 100);
    return simulatedLatency(MOCK_USERS.customer, 100);
  }
};
