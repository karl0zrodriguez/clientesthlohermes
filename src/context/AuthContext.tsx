import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import * as Google from 'expo-auth-session/providers/google';

interface AuthContextType {
  accessToken: string | null;
  userName: string | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      webClientId: '800981151261-3esmj8o7ed7mapbr8cns8dmc81gh9bql.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
    }
  );

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        const { params } = result;
        const idToken = params.id_token;
        setAccessToken(idToken);
        try {
          const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
          setUserName(payload.name || 'Usuario de Google');
        } catch (e) {
          console.error('Failed to decode ID token', e);
          setUserName('Usuario de Google');
        }
      }
    } catch (e) {
      console.error('Login error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [promptAsync]);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUserName(null);
  }, []);

  const value = {
    accessToken,
    userName,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;