'use client';

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import InputDefault from '@/components/Inputs/InputDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const LoginPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl mb-4">Login</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <InputDefault
                    placeholder="Username"
                    value={username}
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <InputDefault
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <ButtonDefault type="submit" label="Login" className="bg-blue-600 text-white p-2" />
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
}

export default LoginPage;