'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import InputDefault from '@/components/Inputs/InputDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(username, password);
            // после успешного логина AuthProvider перенаправит
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="p-6 shadow-md rounded bg-white w-full max-w-sm">
                <h1 className="text-xl font-semibold mb-4">Login</h1>
                {error && <p className="text-red-500 mb-2">{error}</p>}

                <InputDefault
                    label="Username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    customClasses="mb-4"
                />

                <InputDefault
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    customClasses="mb-6"
                />

                <ButtonDefault label={loading ? 'Logging in…' : 'Login'} disabled={loading} type="submit" />
            </form>
        </div>
    );
}