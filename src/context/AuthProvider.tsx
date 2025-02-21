'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface AuthContextType {
    authToken: string | null;
    setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== null) {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp! < currentTime) {
                    logout()
                } else {
                    setAuthToken(token);
                }
            } else {
                router.push('/login');
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        toast.success('Logged out')
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ authToken, setAuthToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}