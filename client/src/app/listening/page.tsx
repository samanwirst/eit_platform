'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TableDefault from '@/components/Tables/TableDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import DelModal from '@/components/ModalWindows/DelModal';
import AlertDefault from '@/components/Alert/AlertDefault';

interface ListeningTest {
    id: string;
    title: string;
    audioFile: {
        id: string;
        name: string;
        type: string;
        size: number;
    };
    coverImage?: {
        id: string;
        name: string;
        type: string;
        size: number;
    };
    sections: Array<{
        id: string;
        content: string;
    }>;
    createdAt: string;
}

const ListeningPage = () => {
    const router = useRouter();
    const [tests, setTests] = useState<ListeningTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = () => {
        const savedTests = localStorage.getItem('listeningTests');
        if (savedTests) {
            try {
                setTests(JSON.parse(savedTests));
            } catch (error) {
                setTests([]);
            }
        }
        setLoading(false);
    };

    const handleDeleteClick = (testId: string) => {
        setDeleteConfirm(testId);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirm) {
            try {
                setDeleteLoading(true);
                const updatedTests = tests.filter(test => test.id !== deleteConfirm);
                setTests(updatedTests);
                localStorage.setItem('listeningTests', JSON.stringify(updatedTests));
                setDeleteConfirm(null);
                AlertDefault.success('Listening test deleted successfully');
            } catch (err) {
                AlertDefault.error('Failed to delete listening test');
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const handleCreateTest = () => {
        router.push('/listening/create');
    };

    const handleRefresh = () => {
        loadTests();
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
            key: 'audioFile',
            label: 'Audio File',
            render: (value: any, row: ListeningTest) => (
                <div>
                    <div className="font-medium">{row.audioFile.name}</div>
                    <div className="text-sm text-gray-500">{formatFileSize(row.audioFile.size)}</div>
                </div>
            ),
        },
        {
            key: 'coverImage',
            label: 'Cover Image',
            render: (value: any, row: ListeningTest) => (
                row.coverImage ? (
                    <div>
                        <div className="font-medium">{row.coverImage.name}</div>
                        <div className="text-sm text-gray-500">{formatFileSize(row.coverImage.size)}</div>
                    </div>
                ) : (
                    <span className="text-gray-400">No image</span>
                )
            ),
        },
        {
            key: 'sections',
            label: 'Sections',
            render: (value: any, row: ListeningTest) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {row.sections.length} sections
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
            render: (value: any, row: ListeningTest) => (
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
                <Breadcrumb pageName="Listening Management" />
                <div className="flex justify-center items-center h-64">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="text-lg text-gray-600">Loading listening tests...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Listening Management" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Listening Management</h1>
                <p className="text-gray-600">Manage listening tests and audio content</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            All Listening Tests ({tests.length})
                        </h2>
                        <div className="flex space-x-3">
                            <ButtonDefault
                                label="Refresh"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                            />
                            <ButtonDefault
                                label="Create New Listening Test"
                                onClick={handleCreateTest}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>

                {tests.length === 0 && !loading ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No listening tests found</h3>
                        <p className="text-gray-500 mb-4">Create your first listening test to get started.</p>
                        <ButtonDefault
                            label="Create First Listening Test"
                            onClick={handleCreateTest}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        />
                    </div>
                ) : (
                    <TableDefault
                        columns={columns}
                        rows={tests}
                        className="rounded-b-lg"
                    />
                )}
            </div>

            <DelModal
                isOpen={!!deleteConfirm}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Confirm Delete"
                message="Are you sure you want to delete this listening test? This action cannot be undone and will remove all associated data."
                confirmText={deleteLoading ? "Deleting..." : "Delete"}
                cancelText="Cancel"
            />
        </div>
    );
};

export default ListeningPage;