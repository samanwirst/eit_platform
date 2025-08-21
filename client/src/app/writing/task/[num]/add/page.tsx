'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RichTextEditor, { RichTextEditorHandle } from '@/components/Editor/RichTextEditor';
import InputDefault from '@/components/Inputs/InputDefault';
import DragAndDropUpload from '@/components/Inputs/DragAndDropUpload';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { createTest } from '@/utils/api';

const WritingSectionAddPage: React.FC = () => {
    const { num } = useParams();       // номер секции из URL
    const router = useRouter();

    const editorRef = useRef<RichTextEditorHandle>(null);
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFiles = (chosen: File[]) => {
        setFiles(chosen);
    };

    const handleSubmit = async () => {
        if (!editorRef.current) {
            alert("Editor not ready");
            return;
        }

        setIsSubmitting(true);
        try {
            const delta = editorRef.current.getContents();
            const contentJson = JSON.stringify(delta);

            const formData = new FormData();
            formData.append('folder', '');
            formData.append('title', title);
            formData.append('section_number', num as string);
            formData.append('section_type', 'writing');
            formData.append('delta', contentJson);
            files.forEach((file) => formData.append('files', file));

            await createTest(formData); // передаём токен

            router.push(`/folders`);
        } catch (err: any) {
            console.error(err);
            alert('Ошибка при сохранении секции: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <Breadcrumb />

            <h1 className="text-2xl font-semibold mb-6">Add Writing Section {num}</h1>

            <div className="mb-6">
                <InputDefault
                    label="Title"
                    name="title"
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    customClasses="mb-4"
                />

                <RichTextEditor ref={editorRef} />

                <DragAndDropUpload
                    onFilesSelected={handleFiles}
                    multiple
                    maxFiles={5}
                    placeholder="Drag & drop images here"
                    className="my-4"
                />
            </div>

            <ButtonDefault
                label={isSubmitting ? 'Submitting…' : 'Create Writing Section'}
                onClick={handleSubmit}
                disabled={isSubmitting}
            />
        </div>
    );
};

export default WritingSectionAddPage;