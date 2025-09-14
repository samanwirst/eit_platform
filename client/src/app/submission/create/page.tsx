'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import InputDefault from '@/components/Inputs/InputDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import ModalWindowDefault from '@/components/ModalWindows/ModalWindowDefault';
import { createTest } from '@/utils/api';
import { getAccessToken } from '@/lib/auth';

interface ListeningData {
    id: string;
    title: string;
    audioFile: {
        id: string;
        name: string;
        type: string;
        size: number;
    } | null;
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
    listeningData: {
        id: string;
        title: string;
        audioFile: File | null;
        sections: Array<{
            id: string;
            content: string;
        }>;
        createdAt: string;
    } | null;
    readingParagraphs: ReadingParagraph[];
    writingTasks: WritingTask[];
}

const SubmissionCreatePage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // Available content from other pages
    const [availableListeningTests, setAvailableListeningTests] = useState<ListeningData[]>([]);
    const [availableReadingParagraphs, setAvailableReadingParagraphs] = useState<ReadingParagraph[]>([]);
    const [availableWritingTasks, setAvailableWritingTasks] = useState<WritingTask[]>([]);

    // Selected content for the mock
    const [mockData, setMockData] = useState<MockData>({
        title: '',
        listeningData: null,
        readingParagraphs: [],
        writingTasks: [],
    });

    // Helper function to get files from IndexedDB for reading/writing
    const getFilesFromIndexedDB = async (fileIds: string[], dbName: string): Promise<File[]> => {
        const files: File[] = [];
        
        for (const fileId of fileIds) {
            try {
                const file = await new Promise<File | null>((resolve, reject) => {
                    const request = indexedDB.open(dbName, 1);
                    
                    request.onerror = () => reject(request.error);
                    
                    request.onsuccess = (event) => {
                        const db = (event.target as IDBOpenDBRequest).result;
                        const transaction = db.transaction(['files'], 'readonly');
                        const store = transaction.objectStore('files');
                        
                        const getRequest = store.get(fileId);
                        getRequest.onsuccess = () => {
                            const result = getRequest.result;
                            resolve(result ? result.file : null);
                        };
                        getRequest.onerror = () => reject(getRequest.error);
                    };
                });
                
                if (file) {
                    files.push(file);
                }
            } catch (error) {
                console.error('Error loading file:', error);
            }
        }
        
        return files;
    };

    // Helper function to get file from IndexedDB
    const getFileFromIndexedDB = async (fileId: string): Promise<File | null> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ListeningFiles', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = db.transaction(['files'], 'readonly');
                const store = transaction.objectStore('files');
                
                const getRequest = store.get(fileId);
                getRequest.onsuccess = () => {
                    const result = getRequest.result;
                    resolve(result ? result.file : null);
                };
                getRequest.onerror = () => reject(getRequest.error);
            };
        });
    };

    // Load available content from localStorage
    useEffect(() => {
        const savedListeningTests = localStorage.getItem('listeningTests');
        const savedReadingParagraphs = localStorage.getItem('readingParagraphs');
        const savedWritingTasks = localStorage.getItem('writingTasks');

        if (savedListeningTests) {
            const tests = JSON.parse(savedListeningTests);
            // For now, just set the tests without files - we'll load files when needed
            setAvailableListeningTests(tests);
        }
        if (savedReadingParagraphs) {
            const paragraphs = JSON.parse(savedReadingParagraphs);
            setAvailableReadingParagraphs(paragraphs);
        }
        if (savedWritingTasks) {
            const tasks = JSON.parse(savedWritingTasks);
            setAvailableWritingTasks(tasks);
        }
    }, []);

    const handleListeningSelect = async (testId: string) => {
        const test = availableListeningTests.find(t => t.id === testId);
        if (test) {
            // Load files from IndexedDB
            const audioFile = test.audioFile?.id ? await getFileFromIndexedDB(test.audioFile.id) : null;
            
            const testWithFiles = {
                ...test,
                audioFile
            };
            
            setMockData(prev => ({
                ...prev,
                listeningData: testWithFiles
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

    const handleWritingTaskSelect = async (taskId: string) => {
        const task = availableWritingTasks.find(t => t.id === taskId);
        if (task) {
            // Load images from IndexedDB
            const imageIds = task.images.map((img: any) => img.id).filter(Boolean);
            const images = imageIds.length > 0 ? await getFilesFromIndexedDB(imageIds, 'WritingFiles') : [];
            
            const taskWithFiles = {
                ...task,
                images
            };
            
            setMockData(prev => ({
                ...prev,
                writingTasks: [...prev.writingTasks, taskWithFiles]
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

        const token = getAccessToken();
        if (!token) {
            alert('Please login first');
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            // Create FormData for file uploads
            const formData = new FormData();
            formData.append('title', mockData.title);

            // Process reading sections
            const readingSections = ['one', 'two', 'three'];
            readingSections.forEach((section, index) => {
                const paragraph = mockData.readingParagraphs[index];
                if (paragraph) {
                    formData.append(`reading.sections.${section}.title`, paragraph.title);
                    // Convert JSON content to plain text if needed
                    const content = typeof paragraph.content === 'string' 
                        ? paragraph.content 
                        : JSON.stringify(paragraph.content);
                    formData.append(`reading.sections.${section}.content`, content);
                    // Reading sections don't have files, but API expects files[] field
                    // We'll skip sending files for reading sections as they're not needed
                } else {
                    formData.append(`reading.sections.${section}.title`, "Something will be here.");
                    formData.append(`reading.sections.${section}.content`, "Something will be here.");
                }
            });

            // Process listening
            if (mockData.listeningData) {
                // Convert JSON content to plain text if needed
                const content = mockData.listeningData.sections.map((s: any) => {
                    return typeof s.content === 'string' ? s.content : JSON.stringify(s.content);
                }).join('\n');
                formData.append('listening.content', content);
                // Add audio file if it's a proper File object
                if (mockData.listeningData.audioFile && mockData.listeningData.audioFile instanceof File) {
                    formData.append('listening.files[]', mockData.listeningData.audioFile);
                }
            } else {
                formData.append('listening.content', "Something will be here.");
            }

            // Process writing sections
            const writingSections = ['one', 'two'];
            writingSections.forEach((section, index) => {
                const task = mockData.writingTasks[index];
                if (task) {
                    formData.append(`writing.sections.${section}.title`, task.title);
                    // Convert JSON content to plain text if needed
                    const content = typeof task.content === 'string' 
                        ? task.content 
                        : JSON.stringify(task.content);
                    formData.append(`writing.sections.${section}.content`, content);
                    // Add files if any - ensure they are File objects
                    if (task.images && Array.isArray(task.images)) {
                        task.images.forEach(file => {
                            if (file instanceof File) {
                                formData.append(`writing.sections.${section}.files[]`, file);
                            }
                        });
                    }
                } else {
                    formData.append(`writing.sections.${section}.title`, "Something will be here.");
                    formData.append(`writing.sections.${section}.content`, "Something will be here.");
                }
            });

            // Send to backend
            const response = await createTest(formData, token) as { ok: boolean; message?: string };
            
            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                throw new Error('Failed to create test');
            }
        } catch (error) {
            console.error('Error creating test:', error);
            alert('Error creating test. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Create Mock Test" />
            
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">IELTS Mock Assembler</h1>
                    <ButtonDefault
                        label="Back to Submission"
                        onClick={() => router.push('/submission')}
                        color="neutral"
                    />
                </div>
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
                            customClasses="mb-4 cursor-pointer"
                        />

                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Listening Section</h2>
                        
                        {availableListeningTests.length > 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Select Listening Test</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleListeningSelect(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    >
                                        <option value="">Choose a listening test...</option>
                                        {availableListeningTests.map(test => (
                                            <option key={test.id} value={test.id}>
                                                {test.title} ({new Date(test.createdAt).toLocaleDateString()})
                                            </option>
                                        ))}
                                    </select>
                                </div>

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
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p>No listening tests created yet.</p>
                                <p className="text-sm mt-2">Go to Listening page to create tests first.</p>
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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
                                                {paragraph.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {mockData.readingParagraphs.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-medium">Selected Reading Paragraphs:</h3>
                                        {mockData.readingParagraphs.map((paragraph, index) => (
                                            <div key={paragraph.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span>{index + 1}. {paragraph.title}</span>
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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
                                                {task.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {mockData.writingTasks.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-medium">Selected Writing Tasks:</h3>
                                        {mockData.writingTasks.map((task, index) => (
                                            <div key={task.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span>{index + 1}. {task.title}</span>
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
                                label={isSubmitting ? 'Creating Test...' : 'Create Test'}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                color="green"
                                className="w-full cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ModalWindowDefault
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    router.push('/submission');
                }}
                closeButton={true}
            >
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Test Created Successfully!</h3>
                    <p className="text-sm text-gray-700 mb-4">
                        Your IELTS test has been saved to the database and is ready for use.
                    </p>
                    <ButtonDefault
                        label="Go to Submission Management"
                        onClick={() => {
                            setShowSuccessModal(false);
                            router.push('/submission');
                        }}
                        color="green"
                    />
                </div>
            </ModalWindowDefault>
        </div>
    );
};

export default SubmissionCreatePage;
