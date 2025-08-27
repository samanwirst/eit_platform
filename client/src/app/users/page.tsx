'use client';

import React, { useState } from 'react';
import TableDefault from '@/components/Tables/TableDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import DelModal from '@/components/ModalWindows/DelModal';
import ModalWindowDefault from '@/components/ModalWindows/ModalWindowDefault';
import CreateUserForm, { CreateUserData } from '@/components/Forms/CreateUserForm';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/utils/api';

const UsersPage = () => {
    const { users, loading, deleteUser, fetchUsers, createUser } = useUsers();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDeleteClick = (userId: string) => {
        setDeleteConfirm(userId);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirm) {
            try {
                setDeleteLoading(true);
                await deleteUser(deleteConfirm);
                setDeleteConfirm(null);
            } catch (err) {
                // Error visible in network panel
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const handleCreateUser = async (userData: CreateUserData) => {
        try {
            setCreateLoading(true);
            await createUser(userData);
            setShowCreateModal(false);
        } catch (err) {
            // Error visible in network panel
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCreateCancel = () => {
        setShowCreateModal(false);
    };

    const handleRefresh = async () => {
        await fetchUsers();
    };

    const columns = [
        { key: '_id', label: 'ID' },
        {
            key: 'fullName',
            label: 'Full Name',
            render: (value: any, row: User) => `${row.firstName} ${row.lastName}`,
        },
        { key: 'phoneNumber', label: 'Phone Number' },
        {
            key: 'role',
            label: 'Role',
            render: (value: string | undefined) => {
                if (!value) {
                    return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">Unknown</span>;
                }
                return (
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${value === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                    >
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, row: User) => (
                <div className="flex space-x-2">
                    <ButtonDefault
                        label="Edit"
                        onClick={() => {
                            // TODO: Implement edit functionality
                        }}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    />
                    <ButtonDefault
                        label="Delete"
                        onClick={() => handleDeleteClick(row._id)}
                        disabled={deleteLoading}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                    />
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <Breadcrumb pageName="Users Management" />
                <div className="flex justify-center items-center h-64">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="text-lg text-gray-600">Loading users...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb pageName="Users Management" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Users Management</h1>
                <p className="text-gray-600">Manage system users, roles, and permissions</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            All Users ({users.length})
                        </h2>
                        <div className="flex space-x-3">
                            <ButtonDefault
                                label="Refresh"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                            />
                            <ButtonDefault
                                label="Add New User"
                                onClick={() => setShowCreateModal(true)}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>

                {users.length === 0 && !loading ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500 mb-4">Create your first user to get started.</p>
                        <ButtonDefault
                            label="Create First User"
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        />
                    </div>
                ) : (
                    <TableDefault
                        columns={columns}
                        rows={users.map(user => ({
                            ...user,
                            fullName: `${user.firstName} ${user.lastName}`,
                        }))}
                        className="rounded-b-lg"
                    />
                )}
            </div>

            <DelModal
                isOpen={!!deleteConfirm}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Confirm Delete"
                message="Are you sure you want to delete this user? This action cannot be undone and will remove all associated data."
                confirmText={deleteLoading ? "Deleting..." : "Delete"}
                cancelText="Cancel"
            />

            <ModalWindowDefault
                isOpen={showCreateModal}
                onClose={handleCreateCancel}
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New User</h2>
                    <CreateUserForm
                        onSubmit={handleCreateUser}
                        onCancel={handleCreateCancel}
                        loading={createLoading}
                    />
                </div>
            </ModalWindowDefault>
        </div>
    );
};

export default UsersPage;