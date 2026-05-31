/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  handleLoginSuccess: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "";

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/me`, {
        withCredentials: true,
      });

      setUser(response.data.authenticated ? response.data.user : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const handleLoginSuccess = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await axios.get(`${backendUrl}/api/auth/logout`, {
      withCredentials: true,
    });

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        refreshAuth,
        handleLoginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export type { AuthContextType, AuthUser };