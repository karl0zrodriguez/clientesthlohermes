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

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      // For web, we use webClientId. The Google provider in expo-auth-session uses webClientId for web.
      webClientId: '800981151261-3esmj8o7ed7mapbr8cns8dmc81gh9bql.apps.googleusercontent.com',
    },
    {}
  );

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        const { params } = result;
        const accessToken = params.access_token;
        const idToken = params.id_token;
        // We can decode the idToken to get user info (optional)
        // For simplicity, we'll just store the access token and set a placeholder name
        setAccessToken(accessToken);
        // In a real app, you would fetch user profile using the access token
        // For now, we'll set a placeholder
        setUserName('Usuario de Google');
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