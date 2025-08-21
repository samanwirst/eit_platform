'use client';

import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableDefault from '@/components/Tables/TableDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const WritingPage = () => {
    const router = useRouter();

    // Writing templates data
    const writingColumns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'wordCount', label: 'Word Count' },
        { key: 'difficulty', label: 'Difficulty' },
        { key: 'status', label: 'Status' },
        { 
            key: 'actions', 
            label: 'Actions',
            render: (value: any, row: any) => (
                <div className="flex space-x-2">
                    <ButtonDefault 
                        label="Start"
                        onClick={() => router.push(`/writing/task/${row.id}`)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    />
                    <ButtonDefault 
                        label="Preview"
                        onClick={() => console.log('Preview writing:', row.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    />
                </div>
            )
        }
    ];

    const writingRows = [
        { 
            id: 1, 
            title: 'Essay Writing Practice', 
            type: 'Academic Essay', 
            wordCount: '500-800',
            difficulty: 'Intermediate',
            status: 'Active'
        },
        { 
            id: 2, 
            title: 'Business Letter Writing', 
            type: 'Business Communication', 
            wordCount: '200-400',
            difficulty: 'Advanced',
            status: 'Active'
        },
        { 
            id: 3, 
            title: 'Creative Story Writing', 
            type: 'Creative Writing', 
            wordCount: '300-600',
            difficulty: 'Beginner',
            status: 'Active'
        },
        { 
            id: 4, 
            title: 'Research Paper Outline', 
            type: 'Research Writing', 
            wordCount: '1000-1500',
            difficulty: 'Advanced',
            status: 'Active'
        },
        { 
            id: 5, 
            title: 'Email Writing Skills', 
            type: 'Professional Email', 
            wordCount: '150-300',
            difficulty: 'Intermediate',
            status: 'Active'
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-4">Writing Templates</h1>
            <p className="text-gray-700 mb-6">Choose a writing template to improve your composition skills</p>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Available Writing Templates</h2>
                        <ButtonDefault 
                            label="Create New Template"
                            onClick={() => console.log('Create new writing template')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        />
                    </div>
                </div>
                
                <TableDefault 
                    columns={writingColumns} 
                    rows={writingRows}
                    className="rounded-b-lg"
                />
            </div>
        </div>
    );
}

export default WritingPage;