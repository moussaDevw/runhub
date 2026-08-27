import { setOnUnauthenticated } from '@/core/api/client';
import { TokenStorage } from '@/core/api/token-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
        const initialToken = await TokenStorage.getAccessToken();
        if (initialToken) {
          const me = await AuthApi.getMe();
          // Le token a pu être rafraîchi par le client API pendant l'appel,
          // on récupère donc la version la plus récente dans le storage.
          const activeToken = await TokenStorage.getAccessToken();
          setUser(me);
          setSession(activeToken);
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

  const login = useCallback(async (
    provider: 'google' | 'apple',
    idToken: string,
    firstName?: string,
    lastName?: string,
  ): Promise<User> => {
    const res = await AuthApi.verifyOAuth(provider, idToken, firstName, lastName);

    try {
      const fullUser = await AuthApi.getMe();
      const finalToken = await TokenStorage.getAccessToken();
      setUser(fullUser);
      setSession(finalToken);
      return fullUser;
    } catch {
      const token = await TokenStorage.getAccessToken();
      setUser(res.user);
      setSession(token);
      return res.user;
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthApi.logout();
    await TokenStorage.clearTokens();
    setUser(null);
    setSession(null);
  }, []);

  // Register logout as the global unauthenticated handler so the API client
  // can trigger it automatically when a 401 cannot be recovered by a token refresh.
  useEffect(() => {
    setOnUnauthenticated(logout);
  }, [logout]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const refreshUser = useCallback(async (): Promise<User> => {
    const fresh = await AuthApi.getMe();
    setUser(fresh);
    return fresh;
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    login,
    logout,
    updateUser,
    refreshUser,
  }), [user, session, isLoading, login, logout, updateUser, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
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

