'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import RichTextEditor, { RichTextEditorHandle } from '@/components/Editor/RichTextEditor';
import InputDefault from '@/components/Inputs/InputDefault';
import ImageUpload from '@/components/Inputs/ImageUpload';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

interface WritingTask {
    id: string;
    title: string;
    content: string;
    images: File[];
    createdAt: string;
}

const WritingTaskPage = () => {
    const router = useRouter();
    const params = useParams();
    const taskNum = params.num as string;
    
    const [task, setTask] = useState<WritingTask>({
        id: taskNum,
        title: '',
        content: '',
        images: [],
        createdAt: new Date().toISOString()
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editorRef = useRef<RichTextEditorHandle>(null);

    // Load existing data on mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('writingTasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            const existingTask = tasks.find((t: WritingTask) => t.id === taskNum);
            if (existingTask) {
                setTask(existingTask);
            }
        }
    }, [taskNum]);

    const handleSubmit = async () => {
        if (!editorRef.current) {
            alert("Editor not ready");
            return;
        }

        if (!task.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        setIsSubmitting(true);
        try {
            const delta = editorRef.current.getContents();
            const contentJson = JSON.stringify(delta);

            const updatedTask: WritingTask = {
                ...task,
                content: contentJson,
                createdAt: new Date().toISOString()
            };

            // Get existing tasks
            const savedTasks = localStorage.getItem('writingTasks');
            let tasks = savedTasks ? JSON.parse(savedTasks) : [];
            
            // Update or add the task
            const existingIndex = tasks.findIndex((t: WritingTask) => t.id === taskNum);
            if (existingIndex >= 0) {
                tasks[existingIndex] = updatedTask;
            } else {
                tasks.push(updatedTask);
            }

            // Save to localStorage
            localStorage.setItem('writingTasks', JSON.stringify(tasks));

            alert('Task saved successfully!');
            router.push('/writing');
        } catch (err: any) {
            console.error(err);
            alert('Error saving task: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb />
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Writing Task {taskNum}</h1>
                    <ButtonDefault
                        label="Back to Writing"
                        onClick={() => router.push('/writing')}
                        color="neutral"
                    />
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <InputDefault
                        label="Task Title"
                        name="title"
                        type="text"
                        placeholder="Enter task title"
                        value={task.title}
                        onChange={e => setTask(prev => ({ ...prev, title: e.target.value }))}
                        required
                        customClasses="mb-4"
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Content</label>
                        <RichTextEditor ref={editorRef} />
                    </div>

                    {taskNum !== '2' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Images</label>
                            <ImageUpload
                                onFilesSelected={(files) => setTask(prev => ({ ...prev, images: files }))}
                                multiple={true}
                                maxFiles={5}
                            />
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <ButtonDefault
                            label={isSubmitting ? 'Saving...' : 'Save Task'}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            color="green"
                        />
                        <ButtonDefault
                            label="Cancel"
                            onClick={() => router.push('/writing')}
                            color="neutral"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WritingTaskPage;