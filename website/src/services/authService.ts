import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { simulatedLatency } from './apiClient';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(identifier: string, _pass: string, requestedRole?: UserRole): Promise<AuthResponse> {
    // Determine user by role or fallback
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
    return simulatedLatency({ user, token }, 300);
  },

  async loginAs(role: UserRole): Promise<AuthResponse> {
    const user = MOCK_USERS[role] || MOCK_USERS.customer;
    const token = `jwt-demo-${user.role}-${Date.now()}`;
    return simulatedLatency({ user, token }, 150);
  },

  async register(userData: Partial<User> & { password?: string }): Promise<AuthResponse> {
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
    return simulatedLatency({ user: newUser, token }, 350);
  },

  async getCurrentUser(token: string): Promise<User | null> {
    if (!token) return null;
    if (token.includes('worker')) return simulatedLatency(MOCK_USERS.worker, 100);
    if (token.includes('admin')) return simulatedLatency(MOCK_USERS.admin, 100);
    return simulatedLatency(MOCK_USERS.customer, 100);
  }
};
