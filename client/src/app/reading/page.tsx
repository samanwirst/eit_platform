'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TableDefault from '@/components/Tables/TableDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import DelModal from '@/components/ModalWindows/DelModal';
import AlertDefault from '@/components/Alert/AlertDefault';

interface ReadingParagraph {
    id: string;
    sectionNumber: number;
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

const ReadingPage = () => {
    const router = useRouter();
    const [paragraphs, setParagraphs] = useState<ReadingParagraph[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadParagraphs();
    }, []);

    const loadParagraphs = () => {
        const savedParagraphs = localStorage.getItem('readingParagraphs');
        if (savedParagraphs) {
            try {
                setParagraphs(JSON.parse(savedParagraphs));
            } catch (error) {
                setParagraphs([]);
            }
        }
        setLoading(false);
    };

    const handleDeleteClick = (paragraphId: string) => {
        setDeleteConfirm(paragraphId);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirm) {
            try {
                setDeleteLoading(true);
                const updatedParagraphs = paragraphs.filter(paragraph => paragraph.id !== deleteConfirm);
                setParagraphs(updatedParagraphs);
                localStorage.setItem('readingParagraphs', JSON.stringify(updatedParagraphs));
                setDeleteConfirm(null);
                AlertDefault.success('Reading paragraph deleted successfully');
            } catch (err) {
                AlertDefault.error('Failed to delete reading paragraph');
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const handleCreateParagraph = (sectionNum: number) => {
        router.push(`/reading/section/${sectionNum}`);
    };

    const handleRefresh = () => {
        loadParagraphs();
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
            key: 'sectionNumber',
            label: 'Section',
            render: (value: number) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Section {value}
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
            render: (value: any, row: ReadingParagraph) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    {row.images.length} images
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
            render: (value: any, row: ReadingParagraph) => (
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
                <Breadcrumb pageName="Reading Management" />
                <div className="flex justify-center items-center h-64">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="text-lg text-gray-600">Loading reading paragraphs...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Reading Management" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reading Management</h1>
                <p className="text-gray-600">Manage reading paragraphs and content</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            All Reading Paragraphs ({paragraphs.length})
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
                                    label="Create Section 1"
                                    onClick={() => handleCreateParagraph(1)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                />
                                <ButtonDefault
                                    label="Create Section 2"
                                    onClick={() => handleCreateParagraph(2)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                />
                                <ButtonDefault
                                    label="Create Section 3"
                                    onClick={() => handleCreateParagraph(3)}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {paragraphs.length === 0 && !loading ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reading paragraphs found</h3>
                        <p className="text-gray-500 mb-4">Create your first reading paragraph to get started.</p>
                        <div className="flex justify-center space-x-2">
                            <ButtonDefault
                                label="Create Section 1"
                                onClick={() => handleCreateParagraph(1)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            />
                            <ButtonDefault
                                label="Create Section 2"
                                onClick={() => handleCreateParagraph(2)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            />
                            <ButtonDefault
                                label="Create Section 3"
                                onClick={() => handleCreateParagraph(3)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            />
                        </div>
                    </div>
                ) : (
                    <TableDefault
                        columns={columns}
                        rows={paragraphs}
                        className="rounded-b-lg"
                    />
                )}
            </div>

            <DelModal
                isOpen={!!deleteConfirm}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Confirm Delete"
                message="Are you sure you want to delete this reading paragraph? This action cannot be undone and will remove all associated data."
                confirmText={deleteLoading ? "Deleting..." : "Delete"}
                cancelText="Cancel"
            />
        </div>
    );
};

export default ReadingPage;