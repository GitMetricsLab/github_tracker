import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosClient from '../api/axiosClient';

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            // Call a backend endpoint to verify session
            const response = await axiosClient.get('/api/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }
        } catch (err) {
            // Not authenticated or session expired
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await axiosClient.post('/api/auth/login', {
                email,
                password,
            });

            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (username: string, email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await axiosClient.post('/api/auth/signup', {
                username,
                email,
                password,
            });

            if (response.status === 201 && response.data.success) {
                setError(null);
            } else {
                setError(response.data.message || 'Signup failed');
                throw new Error(response.data.message || 'Signup failed');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Signup failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await axiosClient.get('/api/auth/logout');
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Logout failed';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                error,
                login,
                signup,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};