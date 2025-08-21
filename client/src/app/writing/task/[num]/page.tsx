'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

const WritingSectionPage = () => {
    const params = useParams();
    const router = useRouter();

    const num = params.num as string;

    const handleAddNewSection = () => {
        router.push(`/writing/task/${num}/add`);
    };

    return (
        <div>
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-4">Writing Task {num}</h1>
            <ButtonDefault label="+ Add" onClick={handleAddNewSection} />
        </div>
    );
}
export default WritingSectionPage;