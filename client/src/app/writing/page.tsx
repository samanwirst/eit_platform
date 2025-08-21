'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const WritingPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/writing/task/1');
    }, [router]);

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-4">Writing</h1>
            <p className="text-gray-700">Redirecting to first writing task...</p>
        </div>
    )
}
export default WritingPage;