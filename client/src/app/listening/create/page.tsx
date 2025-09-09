'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import RichTextEditor, { RichTextEditorHandle } from '@/components/Editor/RichTextEditor';
import InputDefault from '@/components/Inputs/InputDefault';
import AudioUpload from '@/components/Inputs/AudioUpload';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

interface ListeningSection {
    id: string;
    content: string;
}

interface ListeningData {
    title: string;
    audioFile: File | null;
    sections: ListeningSection[];
}

const CreateListeningPage = () => {
    const router = useRouter();
    const [listeningData, setListeningData] = useState<ListeningData>({
        title: '',
        audioFile: null,
        sections: [
            { id: '1', content: '' },
            { id: '2', content: '' },
            { id: '3', content: '' },
            { id: '4', content: '' },
        ]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editorRefs = useRef<(RichTextEditorHandle | null)[]>([]);

    const storeFileInIndexedDB = async (file: File, testId: string, fileType: 'audio'): Promise<string> => {
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
                
                const putRequest = store.put(fileData);
                putRequest.onsuccess = () => resolve(fileId);
                putRequest.onerror = () => reject(putRequest.error);
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

            const finalData = {
                id: testId,
                title: listeningData.title,
                audioFile: {
                    id: audioFileId,
                    name: listeningData.audioFile.name,
                    type: listeningData.audioFile.type,
                    size: listeningData.audioFile.size
                },
                sections: sectionsWithContent,
                createdAt: new Date().toISOString()
            };

            const existingTests = JSON.parse(localStorage.getItem('listeningTests') || '[]');
            existingTests.push(finalData);
            localStorage.setItem('listeningTests', JSON.stringify(existingTests));

            alert('Listening test saved successfully!');
            router.push('/listening');
        } catch (err: any) {
            alert('Error saving listening test: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Create Listening Test" />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Create Listening Test</h1>
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

                        <div>
                            <label className="block text-sm font-medium mb-2">Audio File (for all sections)</label>
                            <AudioUpload
                                onFileSelected={(file) => setListeningData(prev => ({ ...prev, audioFile: file }))}
                            />
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
                        <div className="flex space-x-4">
                            <ButtonDefault
                                label="Cancel"
                                onClick={() => router.push('/listening')}
                                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            />
                            <ButtonDefault
                                label={isSubmitting ? 'Saving...' : 'Save Listening Test'}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateListeningPage;
