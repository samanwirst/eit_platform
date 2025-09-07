'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import RichTextEditor, { RichTextEditorHandle } from '@/components/Editor/RichTextEditor';
import InputDefault from '@/components/Inputs/InputDefault';
import AudioUpload from '@/components/Inputs/AudioUpload';
import ImageUpload from '@/components/Inputs/ImageUpload';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

interface ListeningSection {
    id: string;
    content: string;
}

interface ListeningData {
    title: string;
    audioFile: File | null;
    coverImage: File | null;
    sections: ListeningSection[];
}

const ListeningPage = () => {
    const router = useRouter();
    const [listeningData, setListeningData] = useState<ListeningData>({
        title: '',
        audioFile: null,
        coverImage: null,
        sections: [
            { id: '1', content: '' },
            { id: '2', content: '' },
            { id: '3', content: '' },
            { id: '4', content: '' },
        ]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editorRefs = useRef<(RichTextEditorHandle | null)[]>([]);

    useEffect(() => {
        const savedData = localStorage.getItem('listeningData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setListeningData(parsedData);
            } catch (error) {
                console.error('Error loading listening data:', error);
            }
        }
    }, []);

    const updateSection = (sectionIndex: number, field: keyof ListeningSection, value: any) => {
        setListeningData(prev => ({
            ...prev,
            sections: prev.sections.map((section, index) =>
                index === sectionIndex ? { ...section, [field]: value } : section
            )
        }));
    };

    const storeFileInIndexedDB = async (file: File, testId: string, fileType: 'audio' | 'cover'): Promise<string> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ListeningFiles', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('files')) {
                    db.createObjectStore('files', { keyPath: 'id' });
                }
            };
            
            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = db.transaction(['files'], 'readwrite');
                const store = transaction.objectStore('files');
                
                const fileId = `${testId}_${fileType}`;
                const fileData = {
                    id: fileId,
                    file: file,
                    name: file.name,
                    type: file.type,
                    size: file.size
                };
                
                const addRequest = store.add(fileData);
                addRequest.onsuccess = () => resolve(fileId);
                addRequest.onerror = () => reject(addRequest.error);
            };
        });
    };

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

    const handleSubmit = async () => {
        if (!listeningData.title.trim()) {
            alert('Please enter a listening title');
            return;
        }

        if (!listeningData.audioFile) {
            alert('Please upload an audio file');
            return;
        }

        setIsSubmitting(true);
        try {
            const sectionsWithContent = listeningData.sections.map((section, index) => {
                const editorContent = editorRefs.current[index]?.getContents();
                return {
                    ...section,
                    content: JSON.stringify(editorContent || { ops: [] })
                };
            });

            const testId = `listening_${Date.now()}`;
            const audioFileId = await storeFileInIndexedDB(listeningData.audioFile, testId, 'audio');
            const coverImageId = listeningData.coverImage ? await storeFileInIndexedDB(listeningData.coverImage, testId, 'cover') : null;

            const finalData = {
                id: testId,
                title: listeningData.title,
                audioFile: {
                    id: audioFileId,
                    name: listeningData.audioFile.name,
                    type: listeningData.audioFile.type,
                    size: listeningData.audioFile.size
                },
                coverImage: listeningData.coverImage ? {
                    id: coverImageId,
                    name: listeningData.coverImage.name,
                    type: listeningData.coverImage.type,
                    size: listeningData.coverImage.size
                } : null,
                sections: sectionsWithContent,
                createdAt: new Date().toISOString()
            };

            const existingTests = JSON.parse(localStorage.getItem('listeningTests') || '[]');
            existingTests.push(finalData);
            localStorage.setItem('listeningTests', JSON.stringify(existingTests));

            alert('Listening test saved successfully!');
            
            setListeningData({
                title: '',
                audioFile: null,
                coverImage: null,
                sections: [
                    { id: '1', content: '' },
                    { id: '2', content: '' },
                    { id: '3', content: '' },
                    { id: '4', content: '' }
                ],
            });
        } catch (err: any) {
            console.error(err);
            alert('Error saving listening test: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Listening Test Creator</h1>
                <p className="text-gray-700 mb-6">Create a complete listening test with 4 sections and one audio file</p>

                <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">General Information</h2>
                        
                        <InputDefault
                            label="Listening Test Title"
                            name="title"
                            type="text"
                            placeholder="Enter listening test title"
                            value={listeningData.title}
                            onChange={e => setListeningData(prev => ({ ...prev, title: e.target.value }))}
                            required
                            customClasses="mb-4"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Audio File (for all sections)</label>
                                <AudioUpload
                                    onFileSelected={(file) => setListeningData(prev => ({ ...prev, audioFile: file }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Cover Image</label>
                                <ImageUpload
                                    onFilesSelected={(files) => setListeningData(prev => ({ ...prev, coverImage: files[0] || null }))}
                                    multiple={false}
                                    maxFiles={1}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Section 1</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Section 1 Content</label>
                            <RichTextEditor ref={(el) => { editorRefs.current[0] = el; }} />
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Section 2</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Section 2 Content</label>
                            <RichTextEditor ref={(el) => { editorRefs.current[1] = el; }} />
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Section 3</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Section 3 Content</label>
                            <RichTextEditor ref={(el) => { editorRefs.current[2] = el; }} />
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Section 4</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Section 4 Content</label>
                            <RichTextEditor ref={(el) => { editorRefs.current[3] = el; }} />
                        </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <ButtonDefault
                            label={isSubmitting ? 'Saving...' : 'Save Listening Test'}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            color="green"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListeningPage;