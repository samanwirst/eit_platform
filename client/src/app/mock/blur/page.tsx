'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BlurPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect back to test session after 3 seconds
        const timer = setTimeout(() => {
            router.push('/mock/session');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-red-100 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-red-600 mb-4">Tab Switch Detected</h1>
                <p className="text-gray-700 mb-4">
                    You are not allowed to switch tabs during the test. This is considered cheating.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    You will be redirected back to the test in a few seconds.
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            </div>
        </div>
    );
};

export default BlurPage;
