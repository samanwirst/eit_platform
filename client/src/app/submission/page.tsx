'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TableDefault from '@/components/Tables/TableDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import DelModal from '@/components/ModalWindows/DelModal';
import AlertDefault from '@/components/Alert/AlertDefault';
import { getTests, deleteTest, Test } from '@/utils/api';
import { getAccessToken } from '@/lib/auth';


const SubmissionPage = () => {
    const router = useRouter();
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        const token = getAccessToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await getTests(token);
            if (response.ok) {
                setTests(response.tests);
            }
        } catch (error) {
            console.error('Error loading tests:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteClick = (testId: string) => {
        setDeleteConfirm(testId);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirm) {
            const token = getAccessToken();
            if (!token) {
                AlertDefault.error('Please login first');
                return;
            }

            try {
                setDeleteLoading(true);
                await deleteTest(deleteConfirm, token);
                setTests(tests.filter(test => test._id !== deleteConfirm));
                setDeleteConfirm(null);
                AlertDefault.success('Test deleted successfully');
            } catch (err) {
                AlertDefault.error('Failed to delete test');
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const handleCreateTest = () => {
        router.push('/submission/create');
    };

    const handleRefresh = () => {
        loadTests();
    };

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'reading',
            label: 'Reading Sections',
            render: (value: any, row: Test) => {
                const sections = Object.keys(row.reading?.sections || {}).length;
                return (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {sections} sections
                    </span>
                );
            },
        },
        {
            key: 'listening',
            label: 'Listening',
            render: (value: any, row: Test) => (
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    {row.listening?.files?.length || 0} files
                </span>
            ),
        },
        {
            key: 'writing',
            label: 'Writing Sections',
            render: (value: any, row: Test) => {
                const sections = Object.keys(row.writing?.sections || {}).length;
                return (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {sections} sections
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, row: Test) => (
                <div className="flex space-x-2">
                                                <ButtonDefault
                        label="Delete"
                        onClick={() => handleDeleteClick(row._id)}
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
                <Breadcrumb pageName="Submission Management" />
                <div className="flex justify-center items-center h-64">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="text-lg text-gray-600">Loading submitted tests...</div>
                    </div>
                            </div>
                        </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Submission Management" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Submission Management</h1>
                <p className="text-gray-600">Manage submitted IELTS mock tests</p>
                        </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            All Submitted Tests ({tests.length})
                        </h2>
                        <div className="flex space-x-3">
                            <ButtonDefault
                                label="Refresh"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                            />
                            <ButtonDefault
                                label="Create New Test"
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No submitted tests found</h3>
                        <p className="text-gray-500 mb-4">Create your first test to get started.</p>
                    <ButtonDefault
                            label="Create First Test"
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
                message="Are you sure you want to delete this test? This action cannot be undone and will remove all associated data."
                confirmText={deleteLoading ? "Deleting..." : "Delete"}
                cancelText="Cancel"
            />

        </div>
    );
};

export default SubmissionPage;