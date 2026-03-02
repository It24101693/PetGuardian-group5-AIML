// @ts-ignore
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'vet';
    clinicId?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: 'owner' | 'vet') => Promise<void>;
    register: (name: string, email: string, password: string, role: 'owner' | 'vet', clinicId?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string, role: 'owner' | 'vet') => {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Login failed');
        }

        const data = await response.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const register = async (name: string, email: string, password: string, role: 'owner' | 'vet', clinicId?: string) => {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, clinicId })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Registration failed');
        }

        const data = await response.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Persistence check
    React.useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
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
