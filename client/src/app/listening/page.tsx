'use client';

import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableDefault from '@/components/Tables/TableDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const ListeningPage = () => {
    const router = useRouter();

    // Listening templates data
    const listeningColumns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'duration', label: 'Duration' },
        { key: 'difficulty', label: 'Difficulty' },
        { key: 'status', label: 'Status' },
        { 
            key: 'actions', 
            label: 'Actions',
            render: (value: any, row: any) => (
                <div className="flex space-x-2">
                    <ButtonDefault 
                        label="Start"
                        onClick={() => console.log('Start listening:', row.id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    />
                    <ButtonDefault 
                        label="Preview"
                        onClick={() => console.log('Preview listening:', row.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    />
                </div>
            )
        }
    ];

    const listeningRows = [
        { 
            id: 1, 
            title: 'Academic Lecture Listening', 
            type: 'Academic', 
            duration: '15 min',
            difficulty: 'Advanced',
            status: 'Active'
        },
        { 
            id: 2, 
            title: 'Business Meeting Conversation', 
            type: 'Business', 
            duration: '20 min',
            difficulty: 'Intermediate',
            status: 'Active'
        },
        { 
            id: 3, 
            title: 'Daily Conversation Practice', 
            type: 'Conversational', 
            duration: '10 min',
            difficulty: 'Beginner',
            status: 'Active'
        },
        { 
            id: 4, 
            title: 'News Broadcast Listening', 
            type: 'News', 
            duration: '25 min',
            difficulty: 'Intermediate',
            status: 'Active'
        },
        { 
            id: 5, 
            title: 'Interview Comprehension', 
            type: 'Interview', 
            duration: '30 min',
            difficulty: 'Advanced',
            status: 'Active'
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-4">Listening Templates</h1>
            <p className="text-gray-700 mb-6">Choose a listening template to enhance your comprehension skills</p>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Available Listening Templates</h2>
                        <ButtonDefault 
                            label="Create New Template"
                            onClick={() => console.log('Create new listening template')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        />
                    </div>
                </div>
                
                <TableDefault 
                    columns={listeningColumns} 
                    rows={listeningRows}
                    className="rounded-b-lg"
                />
            </div>
        </div>
    );
}

export default ListeningPage;