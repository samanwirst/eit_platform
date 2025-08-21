'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableDefault from '@/components/Tables/TableDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const ReadingPage = () => {
    const router = useRouter();

    // Reading templates data
    const readingColumns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'difficulty', label: 'Difficulty' },
        { key: 'duration', label: 'Duration' },
        { key: 'status', label: 'Status' },
        { 
            key: 'actions', 
            label: 'Actions',
            render: (value: any, row: any) => (
                <div className="flex space-x-2">
                    <ButtonDefault 
                        label="Start"
                        onClick={() => router.push(`/reading/section/${row.id}`)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    />
                    <ButtonDefault 
                        label="Preview"
                        onClick={() => console.log('Preview reading:', row.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    />
                </div>
            )
        }
    ];

    const readingRows = [
        { 
            id: 1, 
            title: 'Academic Reading Practice', 
            difficulty: 'Intermediate', 
            duration: '45 min',
            status: 'Active'
        },
        { 
            id: 2, 
            title: 'Business Article Analysis', 
            difficulty: 'Advanced', 
            duration: '60 min',
            status: 'Active'
        },
        { 
            id: 3, 
            title: 'Literature Comprehension', 
            difficulty: 'Beginner', 
            duration: '30 min',
            status: 'Active'
        },
        { 
            id: 4, 
            title: 'Scientific Research Paper', 
            difficulty: 'Advanced', 
            duration: '90 min',
            status: 'Active'
        },
        { 
            id: 5, 
            title: 'News Article Reading', 
            difficulty: 'Intermediate', 
            duration: '40 min',
            status: 'Active'
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-4">Reading Templates</h1>
            <p className="text-gray-700 mb-6">Choose a reading template to practice your comprehension skills</p>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Available Reading Templates</h2>
                        <ButtonDefault 
                            label="Create New Template"
                            onClick={() => console.log('Create new reading template')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        />
                    </div>
                </div>
                
                <TableDefault 
                    columns={readingColumns} 
                    rows={readingRows}
                    className="rounded-b-lg"
                />
            </div>
        </div>
    );
}

export default ReadingPage;