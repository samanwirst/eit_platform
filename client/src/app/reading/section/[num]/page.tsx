'use client';

import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const ReadingSectionPage = () => {
    const params = useParams();
    const num = params.num as string;

    return (
        <div>
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-4">Reading Section {num}</h1>
            <p className="text-gray-700">This is the reading section page.</p>
        </div>
    );
}

export default ReadingSectionPage;