import { TokenStorage } from '@/core/api/token-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthApi } from '../api/auth.api';
import { User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  /** Raw access token — truthy when authenticated, used as Stack.Protected guard */
  session: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: 'google' | 'apple', idToken: string, firstName?: string, lastName?: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  refreshUser: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await TokenStorage.getAccessToken();
        if (token) {
          const me = await AuthApi.getMe();
          setUser(me);
          setSession(token);
        }
      } catch {
        // Token invalide/expiré → on nettoie
        await TokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    }
    bootstrap();
  }, []);

  const login = async (
    provider: 'google' | 'apple',
    idToken: string,
    firstName?: string,
    lastName?: string,
  ): Promise<User> => {
    const res = await AuthApi.verifyOAuth(provider, idToken, firstName, lastName);
    const token = await TokenStorage.getAccessToken();

    try {
      const fullUser = await AuthApi.getMe();
      setUser(fullUser);
      setSession(token);
      return fullUser;
    } catch {
      setUser(res.user);
      setSession(token);
      return res.user;
    }
  };

  const logout = async () => {
    await AuthApi.logout();
    await TokenStorage.clearTokens();
    setUser(null);
    setSession(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUser = async (): Promise<User> => {
    const fresh = await AuthApi.getMe();
    setUser(fresh);
    return fresh;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

