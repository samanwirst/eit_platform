'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const ReadingPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/reading/section/1');
    }, [router]);

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-4">Reading</h1>
            <p className="text-gray-700">Redirecting to first reading section...</p>
        </div>
    )
}
export default ReadingPage;