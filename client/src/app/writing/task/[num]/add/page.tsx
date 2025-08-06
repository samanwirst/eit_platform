'use client'

import React, { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RichTextEditor, { RichTextEditorHandle } from '@/components/Editor/RichTextEditor';
import InputDefault from '@/components/Inputs/InputDefault';
import DragAndDropUpload from '@/components/Inputs/DragAndDropUpload';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import { createSection } from '@/utils/api';

const WritingSectionAddPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const num = params.num as string;

    const editorRef = useRef<RichTextEditorHandle>(null);
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFiles = (chosen: File[]) => {
        setFiles(chosen);
    };

    const handleSubmit = async () => {
        if (!editorRef.current) return;
        setIsSubmitting(true);

        try {
            const delta = editorRef.current.getContents();
            console.log('Delta:', delta);
            console.log('JSON:', JSON.stringify(delta));

            const contentJson = JSON.stringify(delta);

            const formData = new FormData();
            formData.append('section_number', num);
            formData.append('title', title);
            formData.append('content', contentJson);
            files.forEach((file) => formData.append('files', file));

            await createSection(formData);

            // router.push(`/sections/${num}`);
        } catch (error) {
            console.error(error);
            alert('Ошибка при сохранении секции');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Add Writing Task {num}</h1>

            <div className="mb-6">
                <InputDefault
                    label="Title"
                    name="title"
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    customClasses='mb-4'
                />

                <RichTextEditor ref={editorRef}/>

                <DragAndDropUpload
                    onFilesSelected={handleFiles}
                    multiple
                    maxFiles={5}
                    placeholder="Drag & drop the writing task image here"
                    className='my-4'
                />
            </div>

            <ButtonDefault
                label={isSubmitting ? 'Submitting…' : 'Add Section'}
                onClick={handleSubmit}
                disabled={isSubmitting}
            />
        </div>
    );
}
export default WritingSectionAddPage;