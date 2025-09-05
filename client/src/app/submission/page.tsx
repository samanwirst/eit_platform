'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import InputDefault from '@/components/Inputs/InputDefault';
import ImageUpload from '@/components/Inputs/ImageUpload';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import ModalWindowDefault from '@/components/ModalWindows/ModalWindowDefault';

interface ListeningData {
    title: string;
    audioFile: File | null;
    coverImage: File | null;
    sections: Array<{
        id: string;
        content: string;
    }>;
    createdAt: string;
}

interface ReadingParagraph {
    id: string;
    title: string;
    content: string;
    images: File[];
    createdAt: string;
}

interface WritingTask {
    id: string;
    title: string;
    content: string;
    images: File[];
    createdAt: string;
}

interface MockData {
    title: string;
    description: string;
    coverImage: File | null;
    listeningData: ListeningData | null;
    readingParagraphs: ReadingParagraph[];
    writingTasks: WritingTask[];
}

const SubmissionPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // Available content from other pages
    const [availableListeningData, setAvailableListeningData] = useState<ListeningData | null>(null);
    const [availableReadingParagraphs, setAvailableReadingParagraphs] = useState<ReadingParagraph[]>([]);
    const [availableWritingTasks, setAvailableWritingTasks] = useState<WritingTask[]>([]);

    // Selected content for the mock
    const [mockData, setMockData] = useState<MockData>({
        title: '',
        description: '',
        coverImage: null,
        listeningData: null,
        readingParagraphs: [],
        writingTasks: [],
    });

    // Load available content from localStorage
    useEffect(() => {
        const savedListeningData = localStorage.getItem('listeningData');
        const savedReadingParagraphs = localStorage.getItem('readingParagraphs');
        const savedWritingTasks = localStorage.getItem('writingTasks');

        if (savedListeningData) {
            setAvailableListeningData(JSON.parse(savedListeningData));
        }
        if (savedReadingParagraphs) {
            setAvailableReadingParagraphs(JSON.parse(savedReadingParagraphs));
        }
        if (savedWritingTasks) {
            setAvailableWritingTasks(JSON.parse(savedWritingTasks));
        }
    }, []);

    const handleListeningSelect = () => {
        if (availableListeningData) {
            setMockData(prev => ({
                ...prev,
                listeningData: availableListeningData
            }));
        }
    };

    const handleReadingParagraphSelect = (paragraphId: string) => {
        const paragraph = availableReadingParagraphs.find(p => p.id === paragraphId);
        if (paragraph) {
            setMockData(prev => ({
                ...prev,
                readingParagraphs: [...prev.readingParagraphs, paragraph]
            }));
        }
    };

    const handleWritingTaskSelect = (taskId: string) => {
        const task = availableWritingTasks.find(t => t.id === taskId);
        if (task) {
            setMockData(prev => ({
                ...prev,
                writingTasks: [...prev.writingTasks, task]
            }));
        }
    };

    const removeListeningData = () => {
        setMockData(prev => ({
            ...prev,
            listeningData: null
        }));
    };

    const removeReadingParagraph = (paragraphId: string) => {
        setMockData(prev => ({
            ...prev,
            readingParagraphs: prev.readingParagraphs.filter(p => p.id !== paragraphId)
        }));
    };

    const removeWritingTask = (taskId: string) => {
        setMockData(prev => ({
            ...prev,
            writingTasks: prev.writingTasks.filter(t => t.id !== taskId)
        }));
    };

    const handleSubmit = async () => {
        if (!mockData.title.trim()) {
            alert('Please enter a mock title');
            return;
        }

        if (!mockData.listeningData && 
            mockData.readingParagraphs.length === 0 && 
            mockData.writingTasks.length === 0) {
            alert('Please select at least one section');
            return;
        }

        setIsSubmitting(true);
        try {
            const mockStructure = {
                _id: `mock_${Date.now()}`,
                title: mockData.title,
                reading: {
                    sections: {
                        one: mockData.readingParagraphs[0] ? {
                            title: mockData.readingParagraphs[0].title,
                            content: mockData.readingParagraphs[0].content,
                            files: mockData.readingParagraphs[0].images.map(() => `file_${Date.now()}_${Math.random()}`)
                        } : {
                            title: "Something will be here.",
                            content: "Something will be here.",
                            files: []
                        },
                        two: mockData.readingParagraphs[1] ? {
                            title: mockData.readingParagraphs[1].title,
                            content: mockData.readingParagraphs[1].content,
                            files: mockData.readingParagraphs[1].images.map(() => `file_${Date.now()}_${Math.random()}`)
                        } : {
                            title: "Something will be here.",
                            content: "Something will be here.",
                            files: []
                        },
                        three: mockData.readingParagraphs[2] ? {
                            title: mockData.readingParagraphs[2].title,
                            content: mockData.readingParagraphs[2].content,
                            files: mockData.readingParagraphs[2].images.map(() => `file_${Date.now()}_${Math.random()}`)
                        } : {
                            title: "Something will be here.",
                            content: "Something will be here.",
                            files: []
                        },
                        four: {
                            title: "Something will be here.",
                            content: "Something will be here.",
                            files: []
                        }
                    }
                },
                listening: {
                    content: mockData.listeningData ? mockData.listeningData.sections.map(s => s.content).join('\n') : "Something will be here.",
                    files: mockData.listeningData && mockData.listeningData.audioFile ? [`audio_${Date.now()}`] : []
                },
                writing: {
                    sections: {
                        one: mockData.writingTasks[0] ? {
                            title: mockData.writingTasks[0].title,
                            content: mockData.writingTasks[0].content,
                            files: mockData.writingTasks[0].images.map(() => `file_${Date.now()}_${Math.random()}`)
                        } : {
                            title: "Something will be here.",
                            content: "Something will be here.",
                            files: []
                        },
                        two: mockData.writingTasks[1] ? {
                            title: mockData.writingTasks[1].title,
                            content: mockData.writingTasks[1].content,
                            files: mockData.writingTasks[1].images.map(() => `file_${Date.now()}_${Math.random()}`)
                        } : {
                            title: "Something will be here.",
                            content: "Something will be here.",
                            files: []
                        }
                    }
                },
                __v: 0
            };

            const downloadJSON = (data: any, filename: string) => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };

            downloadJSON(mockStructure, `${mockData.title.replace(/[^a-zA-Z0-9]/g, '_')}_mock.json`);

            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error creating mock:', error);
            alert('Error creating mock. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Submission" />
            
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">IELTS Mock Assembler</h1>
                <p className="text-gray-700 mb-6">Select content from your created sections to assemble an IELTS mock test</p>

                <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">General Information</h2>
                        
                        <InputDefault
                            label="Mock Title"
                            name="title"
                            type="text"
                            placeholder="Enter mock test title"
                            value={mockData.title}
                            onChange={e => setMockData(prev => ({ ...prev, title: e.target.value }))}
                            required
                            customClasses="mb-4"
                        />

                        <InputDefault
                            label="Description"
                            name="description"
                            type="text"
                            placeholder="Enter mock test description"
                            value={mockData.description}
                            onChange={e => setMockData(prev => ({ ...prev, description: e.target.value }))}
                            customClasses="mb-4"
                        />

                        <div>
                            <label className="block text-sm font-medium mb-2">Cover Image</label>
                            <ImageUpload
                                onFilesSelected={(files) => setMockData(prev => ({ ...prev, coverImage: files[0] || null }))}
                                multiple={false}
                                maxFiles={1}
                            />
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Listening Section</h2>
                        
                        {availableListeningData ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Available Listening Test:</span>
                                    <ButtonDefault
                                        label="Select This Listening Test"
                                        onClick={handleListeningSelect}
                                        color="blue"
                                        className="px-4 py-2"
                                    />
                                </div>
                                <div className="p-3 bg-gray-50 rounded">
                                    <p><strong>Title:</strong> {availableListeningData.title}</p>
                                    <p><strong>Audio:</strong> {availableListeningData.audioFile ? '✅' : '❌'}</p>
                                    <p><strong>Sections:</strong> {availableListeningData.sections.length}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No listening test created yet.</p>
                                <p className="text-sm mt-2">Go to Listening page to create a test first.</p>
                            </div>
                        )}

                        {mockData.listeningData && (
                            <div className="mt-4 p-3 bg-blue-50 rounded">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-blue-800">Selected Listening Test:</span>
                                    <ButtonDefault
                                        label="Remove"
                                        onClick={removeListeningData}
                                        color="red"
                                        className="px-2 py-1 text-xs"
                                    />
                                </div>
                                <p className="text-blue-700">{mockData.listeningData.title}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Reading Paragraphs</h2>
                        
                        {availableReadingParagraphs.length > 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Select Reading Paragraphs</label>
                                    <select 
                                        className="w-full border rounded p-2"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleReadingParagraphSelect(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    >
                                        <option value="">Choose a reading paragraph...</option>
                                        {availableReadingParagraphs.map(paragraph => (
                                            <option key={paragraph.id} value={paragraph.id}>
                                                Paragraph {paragraph.id}: {paragraph.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {mockData.readingParagraphs.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-medium">Selected Reading Paragraphs:</h3>
                                        {mockData.readingParagraphs.map((paragraph, index) => (
                                            <div key={paragraph.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span>{index + 1}. Paragraph {paragraph.id}: {paragraph.title}</span>
                                                <ButtonDefault
                                                    label="Remove"
                                                    onClick={() => removeReadingParagraph(paragraph.id)}
                                                    color="red"
                                                    className="px-2 py-1 text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No reading paragraphs created yet.</p>
                                <p className="text-sm mt-2">Go to Reading page to create paragraphs first.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Writing Tasks</h2>
                        
                        {availableWritingTasks.length > 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Select Writing Tasks</label>
                                    <select 
                                        className="w-full border rounded p-2"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleWritingTaskSelect(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    >
                                        <option value="">Choose a writing task...</option>
                                        {availableWritingTasks.map(task => (
                                            <option key={task.id} value={task.id}>
                                                Task {task.id}: {task.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {mockData.writingTasks.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-medium">Selected Writing Tasks:</h3>
                                        {mockData.writingTasks.map((task, index) => (
                                            <div key={task.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span>{index + 1}. Task {task.id}: {task.title}</span>
                                                <ButtonDefault
                                                    label="Remove"
                                                    onClick={() => removeWritingTask(task.id)}
                                                    color="red"
                                                    className="px-2 py-1 text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No writing tasks created yet.</p>
                                <p className="text-sm mt-2">Go to Writing page to create tasks first.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Mock Summary</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Mock Title</label>
                                <p className="text-lg font-semibold">{mockData.title || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Description</label>
                                <p className="text-gray-800">{mockData.description || 'No description'}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                <span className="font-medium">Listening Test</span>
                                <span className="text-blue-600">{mockData.listeningData ? '✅ Selected' : '❌ Not selected'}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                <span className="font-medium">Reading Paragraphs</span>
                                <span className="text-green-600">{mockData.readingParagraphs.length} selected</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                                <span className="font-medium">Writing Tasks</span>
                                <span className="text-purple-600">{mockData.writingTasks.length} selected</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <ButtonDefault
                                label={isSubmitting ? 'Creating Mock...' : 'Create Mock Test'}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                color="green"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ModalWindowDefault
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    router.push('/');
                }}
                closeButton={true}
            >
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Mock Created Successfully!</h3>
                    <p className="text-sm text-gray-700 mb-4">
                        Your IELTS mock test has been assembled and JSON files have been downloaded.
                    </p>
                    <ButtonDefault
                        label="Go to Dashboard"
                        onClick={() => {
                            setShowSuccessModal(false);
                            router.push('/');
                        }}
                        color="green"
                    />
                </div>
            </ModalWindowDefault>
        </div>
    );
};

export default SubmissionPage;