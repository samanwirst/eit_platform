'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RichTextEditor, { RichTextEditorHandle } from '@/components/Editor/RichTextEditor';
import InputDefault from '@/components/Inputs/InputDefault';
import DragAndDropUpload from '@/components/Inputs/DragAndDropUpload';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import { createTest } from '@/utils/api';

const WritingSectionAddPage: React.FC = () => {
    const { num } = useParams();       // номер секции из URL
    const router = useRouter();

    const editorRef = useRef<RichTextEditorHandle>(null);
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Забираем токен из localStorage (или context)
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        setToken(localStorage.getItem('accessToken'));
    }, []);

    const handleFiles = (chosen: File[]) => {
        setFiles(chosen);
    };

    const handleSubmit = async () => {
        if (!editorRef.current || !token) return;
        setIsSubmitting(true);

        try {
            // 1) Собираем Delta
            const delta = editorRef.current.getContents();
            const contentJson = JSON.stringify(delta);

            // 2) Формируем FormData
            const formData = new FormData();
            formData.append('folder', '');              // <-- при необходимости передай ID папки
            formData.append('title', title);
            formData.append('section_number', num);
            formData.append('section_type', 'writing'); // <-- фиксируем тип секции
            formData.append('delta', contentJson);
            files.forEach((file) => formData.append('files', file));

            // 3) Отправляем на бэк
            await createTest(formData);

            // 4) Редирект на список секций или страницу теста
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
            <h1 className="text-2xl font-semibold mb-6">Add Writing Section {num}</h1>

            <div className="space-y-6 mb-6">
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