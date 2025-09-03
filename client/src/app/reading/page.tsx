'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const ReadingPage = () => {
    const router = useRouter();

    const handleSectionClick = (sectionNum: number) => {
        router.push(`/reading/section/${sectionNum}`);
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Reading Test Creator</h1>
                <p className="text-gray-700 mb-6">Create reading paragraphs for your IELTS mock test</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Section 1 */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📖</div>
                            <h2 className="text-xl font-semibold mb-2">Paragraph 1</h2>
                            <p className="text-gray-600 mb-4">Create the first reading paragraph</p>
                            <ButtonDefault
                                label="Create Paragraph 1"
                                onClick={() => handleSectionClick(1)}
                                color="blue"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📚</div>
                            <h2 className="text-xl font-semibold mb-2">Paragraph 2</h2>
                            <p className="text-gray-600 mb-4">Create the second reading paragraph</p>
                            <ButtonDefault
                                label="Create Paragraph 2"
                                onClick={() => handleSectionClick(2)}
                                color="blue"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <h2 className="text-xl font-semibold mb-2">Paragraph 3</h2>
                            <p className="text-gray-600 mb-4">Create the third reading paragraph</p>
                            <ButtonDefault
                                label="Create Paragraph 3"
                                onClick={() => handleSectionClick(3)}
                                color="blue"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">How it works:</h3>
                    <ul className="text-blue-700 space-y-1">
                        <li>• Click on any paragraph to create content</li>
                        <li>• Each paragraph has its own rich text editor</li>
                        <li>• Upload images for each paragraph</li>
                        <li>• All paragraphs will be available in the Mock Assembler</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ReadingPage;