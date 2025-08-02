'use client';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const WritingSectionPage = () => {
    const params = useParams();
    const router = useRouter();

    const num = params.num as string;

    const handleAddNewSection = () => {
        router.push(`/writing/task/${num}/add`);
    };

    return (
        <div>
            <h1>Writing Task {num}</h1>
            <ButtonDefault label="+ Add" onClick={handleAddNewSection} />
        </div>
    );
}
export default WritingSectionPage;