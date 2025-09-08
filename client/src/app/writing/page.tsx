'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TableDefault from '@/components/Tables/TableDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import DelModal from '@/components/ModalWindows/DelModal';
import AlertDefault from '@/components/Alert/AlertDefault';

interface WritingTask {
    id: string;
    taskNumber: number;
    title: string;
    content: string;
    images: Array<{
        id: string;
        name: string;
        type: string;
        size: number;
    }>;
    createdAt: string;
}

const WritingPage = () => {
    const router = useRouter();
    const [tasks, setTasks] = useState<WritingTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        const savedTasks = localStorage.getItem('writingTasks');
        if (savedTasks) {
            try {
                setTasks(JSON.parse(savedTasks));
            } catch (error) {
                setTasks([]);
            }
        }
        setLoading(false);
    };

    const handleDeleteClick = (taskId: string) => {
        setDeleteConfirm(taskId);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirm) {
            try {
                setDeleteLoading(true);
                const updatedTasks = tasks.filter(task => task.id !== deleteConfirm);
                setTasks(updatedTasks);
                localStorage.setItem('writingTasks', JSON.stringify(updatedTasks));
                setDeleteConfirm(null);
                AlertDefault.success('Writing task deleted successfully');
            } catch (err) {
                AlertDefault.error('Failed to delete writing task');
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const handleCreateTask = (taskNum: number) => {
        router.push(`/writing/task/${taskNum}`);
    };

    const handleRefresh = () => {
        loadTasks();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'taskNumber',
            label: 'Task',
            render: (value: number) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    Task {value}
                </span>
            ),
        },
        {
            key: 'content',
            label: 'Content Preview',
            render: (value: string) => {
                const content = JSON.parse(value || '{"ops":[]}');
                const textContent = content.ops?.map((op: any) => op.insert || '').join('').substring(0, 100);
                return (
                    <div className="max-w-xs">
                        <div className="text-sm text-gray-600 truncate">
                            {textContent || 'No content'}
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'images',
            label: 'Images',
            render: (value: any, row: WritingTask) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {row.images?.length || 0} images
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (value: string) => formatDate(value),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, row: WritingTask) => (
                <div className="flex space-x-2">
                    <ButtonDefault
                        label="Delete"
                        onClick={() => handleDeleteClick(row.id)}
                        disabled={deleteLoading}
                        className="w-30 h-10 px-3 py-1 bg-red-500 text-white text-md rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                    />
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <Breadcrumb pageName="Writing Management" />
                <div className="flex justify-center items-center h-64">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="text-lg text-gray-600">Loading writing tasks...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Writing Management" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Writing Management</h1>
                <p className="text-gray-600">Manage writing tasks and content</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            All Writing Tasks ({tasks.length})
                        </h2>
                        <div className="flex space-x-3">
                            <ButtonDefault
                                label="Refresh"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                            />
                            <div className="flex space-x-2">
                                <ButtonDefault
                                    label="Create Task 1"
                                    onClick={() => handleCreateTask(1)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                                />
                                <ButtonDefault
                                    label="Create Task 2"
                                    onClick={() => handleCreateTask(2)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {tasks.length === 0 && !loading ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No writing tasks found</h3>
                        <p className="text-gray-500 mb-4">Create your first writing task to get started.</p>
                        <div className="flex justify-center space-x-2">
                            <ButtonDefault
                                label="Create Task 1"
                                onClick={() => handleCreateTask(1)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            />
                            <ButtonDefault
                                label="Create Task 2"
                                onClick={() => handleCreateTask(2)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            />
                        </div>
                    </div>
                ) : (
                    <TableDefault
                        columns={columns}
                        rows={tasks}
                        className="rounded-b-lg"
                    />
                )}
            </div>

            <DelModal
                isOpen={!!deleteConfirm}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Confirm Delete"
                message="Are you sure you want to delete this writing task? This action cannot be undone and will remove all associated data."
                confirmText={deleteLoading ? "Deleting..." : "Delete"}
                cancelText="Cancel"
            />
        </div>
    );
};

export default WritingPage;