'use client';

import React, { useState } from 'react';
import TableDefault from '@/components/Tables/TableDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import DelModal from '@/components/ModalWindows/DelModal';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/utils/api';

const UsersPage = () => {
    const { users, loading, error, deleteUser, fetchUsers } = useUsers();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const handleDeleteClick = (userId: string) => {
        setDeleteConfirm(userId);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirm) {
            await deleteUser(deleteConfirm);
            setDeleteConfirm(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    const columns = [
        { key: '_id', label: 'ID' },
        {
            key: 'fullName',
            label: 'Full Name',
            render: (value: any, row: User) => `${row.firstName} ${row.lastName}`,
        },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'role', label: 'Role' },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, row: User) => (
                <div className="flex space-x-2">
                    <ButtonDefault
                        label="Edit"
                        onClick={() => console.log('Edit user:', row._id)}
                        className="px-7 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    />
                    <ButtonDefault
                        label="Delete"
                        onClick={() => handleDeleteClick(row._id)}
                        className="px-7 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
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
                    <div className="text-lg text-gray-600">Loading users...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Breadcrumb pageName="Users Management" />
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-800">
                        <h3 className="text-lg font-medium">Error</h3>
                        <p className="mt-1">{error}</p>
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
                                onClick={fetchUsers}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            />
                            <ButtonDefault
                                label="Add New User"
                                onClick={() => console.log('Add new user')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {users.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No users found. Create your first user to get started.
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
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />

        </div>
    );
};

export default UsersPage;
