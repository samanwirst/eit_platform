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
            // Get content from all editors
            const sectionsWithContent = listeningData.sections.map((section, index) => {
                const editorContent = editorRefs.current[index]?.getContents();
                return {
                    ...section,
                    content: JSON.stringify(editorContent || { ops: [] })
                };
            });

            const finalData = {
                ...listeningData,
                sections: sectionsWithContent,
                createdAt: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem('listeningData', JSON.stringify(finalData));

            alert('Listening data saved successfully!');
        } catch (err: any) {
            console.error(err);
            alert('Error saving listening data: ' + err.message);
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