import { User, UserRole, WorkerProfile } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
  profile?: WorkerProfile | null;
}

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || '/api';

function mapUser(data: any, identifier: string): User {
  const backendRole = data?.role;

  const role = (
    backendRole === 'coop_admin'
      ? 'admin'
      : backendRole
  ) as UserRole;

  if (!data?.id || !data?.name || !role) {
    throw new Error('Invalid user data returned by server');
  }

  return {
    id: String(data.id),
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
    joinedDate: data.created_at
      ? new Date(data.created_at)
          .toISOString()
          .split('T')[0]
      : undefined,
  };
}

export const authService = {

  /*
   * LOGIN
   *
   * Backend returns:
   * {
   *   token,
   *   user,
   *   profile
   * }
   *
   * We preserve all three.
   */
  async login(
    identifier: string,
    pass: string,
    _requestedRole?: UserRole
  ): Promise<AuthResponse> {

    const res = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: identifier.trim(),
          password: pass,
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (
      !res.ok ||
      !data.token ||
      !data.user
    ) {
      throw new Error(
        data.error ||
        `Login failed (${res.status})`
      );
    }

    const user = mapUser(
      data.user,
      identifier
    );

    /*
     * Store the real authentication token.
     */
    localStorage.setItem(
      'sahakargig_token',
      data.token
    );

    localStorage.setItem(
      'sahakar_auth_token',
      data.token
    );

    /*
     * Store the real logged-in user.
     */
    localStorage.setItem(
      'sahakargig_user',
      JSON.stringify(user)
    );

    /*
     * Store the real worker profile returned
     * by the backend.
     *
     * No Ravi Kumar / demo profile.
     */
    if (data.profile) {
      localStorage.setItem(
        'sahakargig_worker_profile',
        JSON.stringify(data.profile)
      );
    } else {
      localStorage.removeItem(
        'sahakargig_worker_profile'
      );
    }

    return {
      user,
      token: data.token,
      profile: data.profile || null,
    };
  },


  /*
   * CUSTOMER REGISTRATION
   */
  async register(
    userData: Partial<User> & {
      password?: string;
    }
  ): Promise<AuthResponse> {

    const requestedRole =
      userData.role === 'worker'
        ? 'worker'
        : 'customer';

    /*
     * Worker registration uses the dedicated
     * worker onboarding flow.
     */
    if (requestedRole === 'worker') {
      throw new Error(
        'Worker self-registration requires cooperative onboarding. Please use the worker onboarding flow.'
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          role: requestedRole,
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (
      !res.ok ||
      !data.user
    ) {
      throw new Error(
        data.error ||
        `Registration failed (${res.status})`
      );
    }

    /*
     * Immediately login the newly created
     * real account.
     */
    return this.login(
      String(userData.email),
      String(userData.password),
      requestedRole
    );
  },


  /*
   * GET CURRENT USER
   *
   * First try the real backend /auth/me endpoint.
   * This is more reliable than trusting only
   * the JWT payload.
   */
  async getCurrentUser(
    token: string
  ): Promise<User | null> {

    if (!token) {
      return null;
    }

    try {

      const res = await fetch(
        `${API_BASE_URL}/auth/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        return null;
      }

      const data = await res
        .json()
        .catch(() => null);

      if (!data?.user?.id) {
        return null;
      }

      const user = mapUser(
        data.user,
        data.user.email || ''
      );

      /*
       * Keep the latest real user information.
       */
      localStorage.setItem(
        'sahakargig_user',
        JSON.stringify(user)
      );

      /*
       * Keep the latest real worker profile.
       */
      if (data.profile) {
        localStorage.setItem(
          'sahakargig_worker_profile',
          JSON.stringify(data.profile)
        );
      }

      return user;

    } catch {
      return null;
    }
  },


  /*
   * GET CURRENT WORKER PROFILE
   *
   * Used when dashboard needs the exact
   * worker who is currently logged in.
   */
  async getCurrentWorkerProfile(
    token: string
  ): Promise<WorkerProfile | null> {

    if (!token) {
      return null;
    }

    try {

      const res = await fetch(
        `${API_BASE_URL}/auth/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        return null;
      }

      const data = await res
        .json()
        .catch(() => null);

      if (!data?.profile) {
        return null;
      }

      localStorage.setItem(
        'sahakargig_worker_profile',
        JSON.stringify(data.profile)
      );

      return data.profile as WorkerProfile;

    } catch {
      return null;
    }
  },
};
