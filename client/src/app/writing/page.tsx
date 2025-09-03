'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const WritingPage = () => {
    const router = useRouter();

    const handleTaskClick = (taskNum: number) => {
        router.push(`/writing/task/${taskNum}`);
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Writing Test Creator</h1>
                <p className="text-gray-700 mb-6">Create writing tasks for your IELTS mock test</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Task 1 */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="text-4xl mb-4">✍️</div>
                            <h2 className="text-xl font-semibold mb-2">Task 1</h2>
                            <p className="text-gray-600 mb-4">Create the first writing task (usually descriptive)</p>
                            <ButtonDefault
                                label="Create Task 1"
                                onClick={() => handleTaskClick(1)}
                                color="blue"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Task 2 */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <h2 className="text-xl font-semibold mb-2">Task 2</h2>
                            <p className="text-gray-600 mb-4">Create the second writing task (usually essay)</p>
                            <ButtonDefault
                                label="Create Task 2"
                                onClick={() => handleTaskClick(2)}
                                color="blue"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">How it works:</h3>
                    <ul className="text-green-700 space-y-1">
                        <li>• Click on any task to create content</li>
                        <li>• Each task has its own rich text editor</li>
                        <li>• Upload images for each task</li>
                        <li>• All tasks will be available in the Mock Assembler</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WritingPage;