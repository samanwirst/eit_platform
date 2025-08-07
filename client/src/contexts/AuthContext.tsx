'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, refreshToken as apiRefresh } from '@/utils/api';

interface AuthContextValue {
    user: { username: string; role: string } | null;
    accessToken: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);

    // при старте читаем из localStorage
    useEffect(() => {
        const at = localStorage.getItem('accessToken');
        const rt = localStorage.getItem('refreshToken');
        const usr = localStorage.getItem('user');
        if (at && rt && usr) {
            setAccessToken(at);
            setRefreshToken(rt);
            setUser(JSON.parse(usr));
        }
    }, []);

    // переадресация на логин, если неавторизован и не на /login
    useEffect(() => {
        const publicPaths = ['/login'];
        if (!accessToken && !publicPaths.includes(window.location.pathname)) {
            router.replace('/login');
        }
    }, [accessToken, router]);

    const login = async (username: string, password: string) => {
        const { access, refresh } = await apiLogin(username, password);
        // здесь apiLogin делает POST("/token/")
        // и возвращает { access, refresh }
        // в твоём api.ts реализуй это так:
        // export const login = (u,p) => post<{access:string,refresh:string}>('/token/', {username:u,password:p});
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        // декодируем токен, чтобы получить username/role
        const payload = JSON.parse(atob(access.split('.')[1]));
        const usr = { username: payload.username, role: payload.role };
        localStorage.setItem('user', JSON.stringify(usr));
        setAccessToken(access);
        setRefreshToken(refresh);
        setUser(usr);
        router.replace('/'); // после логина на главную или dashboard
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        router.replace('/login');
    };

    // автоматический рефреш токена при истечении срока (упрощённо)
    useEffect(() => {
        if (!refreshToken) return;
        const interval = setInterval(async () => {
            try {
                const { access: newAccess } = await apiRefresh(refreshToken);
                localStorage.setItem('accessToken', newAccess);
                setAccessToken(newAccess);
            } catch {
                logout();
            }
        }, 1000 * 60 * 10); // каждые 10 минут
        return () => clearInterval(interval);
    }, [refreshToken]);

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};