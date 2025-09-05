'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import RichTextEditor, { RichTextEditorHandle } from '@/components/Editor/RichTextEditor';
import InputDefault from '@/components/Inputs/InputDefault';
import ImageUpload from '@/components/Inputs/ImageUpload';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

interface ReadingParagraph {
    id: string;
    title: string;
    content: string;
    images: File[];
    createdAt: string;
}

const ReadingSectionPage = () => {
    const router = useRouter();
    const params = useParams();
    const sectionNum = params.num as string;
    
    const [paragraph, setParagraph] = useState<ReadingParagraph>({
        id: sectionNum,
        title: '',
        content: '',
        images: [],
        createdAt: new Date().toISOString()
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editorRef = useRef<RichTextEditorHandle>(null);

    // Load existing data on mount
    useEffect(() => {
        const savedParagraphs = localStorage.getItem('readingParagraphs');
        if (savedParagraphs) {
            const paragraphs = JSON.parse(savedParagraphs);
            const existingParagraph = paragraphs.find((p: ReadingParagraph) => p.id === sectionNum);
            if (existingParagraph) {
                setParagraph(existingParagraph);
            }
        }
    }, [sectionNum]);

    const handleSubmit = async () => {
        if (!editorRef.current) {
            alert("Editor not ready");
            return;
        }

        if (!paragraph.title.trim()) {
            alert('Please enter a paragraph title');
            return;
        }

        setIsSubmitting(true);
        try {
            const delta = editorRef.current.getContents();
            const contentJson = JSON.stringify(delta);

            const updatedParagraph: ReadingParagraph = {
                ...paragraph,
                content: contentJson,
                createdAt: new Date().toISOString()
            };

            // Get existing paragraphs
            const savedParagraphs = localStorage.getItem('readingParagraphs');
            let paragraphs = savedParagraphs ? JSON.parse(savedParagraphs) : [];
            
            // Update or add the paragraph
            const existingIndex = paragraphs.findIndex((p: ReadingParagraph) => p.id === sectionNum);
            if (existingIndex >= 0) {
                paragraphs[existingIndex] = updatedParagraph;
            } else {
                paragraphs.push(updatedParagraph);
            }

            // Save to localStorage
            localStorage.setItem('readingParagraphs', JSON.stringify(paragraphs));

            alert('Paragraph saved successfully!');
            router.push('/reading');
        } catch (err: any) {
            console.error(err);
            alert('Error saving paragraph: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Reading Paragraph {sectionNum}</h1>
                    <ButtonDefault
                        label="Back to Reading"
                        onClick={() => router.push('/reading')}
                        color="neutral"
                    />
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <InputDefault
                        label="Paragraph Title"
                        name="title"
                        type="text"
                        placeholder="Enter paragraph title"
                        value={paragraph.title}
                        onChange={e => setParagraph(prev => ({ ...prev, title: e.target.value }))}
                        required
                        customClasses="mb-4"
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Content</label>
                        <RichTextEditor ref={editorRef} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Images</label>
                        <ImageUpload
                            onFilesSelected={(files) => setParagraph(prev => ({ ...prev, images: files }))}
                            multiple={true}
                            maxFiles={5}
                        />
                    </div>

                    <div className="flex space-x-4">
                        <ButtonDefault
                            label={isSubmitting ? 'Saving...' : 'Save Paragraph'}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            color="green"
                        />
                        <ButtonDefault
                            label="Cancel"
                            onClick={() => router.push('/reading')}
                            color="neutral"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadingSectionPage;