'use client';

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import InputDefault from '@/components/Inputs/InputDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const LoginPage = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Phone number validation: must be exactly 12 digits starting with 998
    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^998\d{9}$/;
        return phoneRegex.test(phone);
    };

    // Password validation: one uppercase, one lowercase, one number, one symbol
    const validatePassword = (password: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate phone number format
        if (!validatePhoneNumber(phoneNumber)) {
            setError("Phone number must be in format: 998123456789");
            return;
        }

        // Validate password requirements
        if (!validatePassword(password)) {
            setError("Password must contain: one uppercase letter, one lowercase letter, one number, and one symbol");
            return;
        }

        try {
            await login(phoneNumber, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl mb-4">Login</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                    <InputDefault
                        placeholder="Phone Number (998123456789)"
                        value={phoneNumber}
                        type="tel"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={12}
                    />
                    <p className="text-sm text-gray-500 mt-1">Format: 998123456789</p>
                </div>
                <div>
                    <InputDefault
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Must contain: uppercase, lowercase, number, symbol
                    </p>
                </div>
                <ButtonDefault type="submit" label="Login" className="bg-blue-600 text-white p-2" />
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
}

export default LoginPage;