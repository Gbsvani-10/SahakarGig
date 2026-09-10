import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    identifier: string,
    pass: string,
    requestedRole?: UserRole
  ) => Promise<void>;

  adoptSession: (
    user: User,
    token: string
  ) => void;

  register: (
    userData: Partial<User> & {
      password?: string;
    }
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(
      () =>
        localStorage.getItem(
          'sahakar_auth_token'
        ) ||
        localStorage.getItem(
          'sahakargig_token'
        )
    );

  const [role, setRole] =
    useState<UserRole>('guest');

  const [isLoading, setIsLoading] =
    useState(true);


  /*
   * RESTORE REAL LOGIN SESSION
   *
   * Browser refresh ayina:
   *
   * token
   *   ↓
   * /api/auth/me
   *   ↓
   * real user
   *   ↓
   * real worker profile
   */
  useEffect(() => {

    const restore = async () => {

      const savedToken =
        localStorage.getItem(
          'sahakar_auth_token'
        ) ||
        localStorage.getItem(
          'sahakargig_token'
        );

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {

        const restoredUser =
          await authService.getCurrentUser(
            savedToken
          );

        if (restoredUser) {

          setUser(restoredUser);

          setRole(
            restoredUser.role
          );

          setToken(savedToken);

          localStorage.setItem(
            'sahakar_auth_token',
            savedToken
          );

          localStorage.setItem(
            'sahakargig_token',
            savedToken
          );

          localStorage.setItem(
            'sahakar_user_role',
            restoredUser.role
          );

        } else {

          /*
           * Token invalid / expired.
           */
          clearSession();

        }

      } catch (error) {

        console.error(
          'Session restore failed:',
          error
        );

        clearSession();

      } finally {

        setIsLoading(false);

      }
    };

    restore();

  }, []);


  /*
   * SAVE AUTH SESSION
   */
  const persist = (res: {
    user: User;
    token: string;
  }) => {

    setUser(res.user);

    setRole(res.user.role);

    setToken(res.token);

    /*
     * Keep both token keys because
     * existing application API code
     * uses sahakar_auth_token.
     */
    localStorage.setItem(
      'sahakar_auth_token',
      res.token
    );

    localStorage.setItem(
      'sahakargig_token',
      res.token
    );

    localStorage.setItem(
      'sahakar_user_role',
      res.user.role
    );

    localStorage.setItem(
      'sahakargig_user',
      JSON.stringify(res.user)
    );
  };


  /*
   * CLEAR SESSION
   */
  const clearSession = () => {

    setUser(null);

    setRole('guest');

    setToken(null);

    localStorage.removeItem(
      'sahakar_auth_token'
    );

    localStorage.removeItem(
      'sahakargig_token'
    );

    localStorage.removeItem(
      'sahakar_user_role'
    );

    localStorage.removeItem(
      'sahakargig_user'
    );

    /*
     * IMPORTANT:
     * Remove previous worker profile.
     *
     * Otherwise old worker data could
     * appear after another login.
     */
    localStorage.removeItem(
      'sahakargig_worker_profile'
    );
  };


  /*
   * LOGIN
   */
  const login = async (
    identifier: string,
    pass: string,
    requestedRole?: UserRole
  ) => {

    setIsLoading(true);

    try {

      const response =
        await authService.login(
          identifier,
          pass,
          requestedRole
        );

      persist(response);

    } finally {

      setIsLoading(false);

    }
  };


  /*
   * ADOPT SESSION
   *
   * Used by portal authentication flow.
   */
  const adoptSession = (
    sessionUser: User,
    sessionToken: string
  ) => {

    setUser(sessionUser);

    setRole(
      sessionUser.role
    );

    setToken(sessionToken);

    localStorage.setItem(
      'sahakar_auth_token',
      sessionToken
    );

    localStorage.setItem(
      'sahakargig_token',
      sessionToken
    );

    localStorage.setItem(
      'sahakar_user_role',
      sessionUser.role
    );

    localStorage.setItem(
      'sahakargig_user',
      JSON.stringify(sessionUser)
    );
  };


  /*
   * REGISTER
   */
  const register = async (
    userData: Partial<User> & {
      password?: string;
    }
  ) => {

    setIsLoading(true);

    try {

      const response =
        await authService.register(
          userData
        );

      persist(response);

    } finally {

      setIsLoading(false);

    }
  };


  /*
   * LOGOUT
   */
  const logout = () => {

    clearSession();

  };


  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,

        isAuthenticated:
          !!user &&
          role !== 'guest',

        isLoading,

        login,
        adoptSession,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth =
  (): AuthContextType => {

    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        'useAuth must be used within an AuthProvider'
      );
    }

    return context;
  };
