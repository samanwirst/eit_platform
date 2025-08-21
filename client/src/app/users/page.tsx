'use client';

import React from 'react';
import TableDefault from '@/components/Tables/TableDefault';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const UsersPage = () => {
    // Static data for demonstration
    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
        { key: 'lastLogin', label: 'Last Login' },
        { 
            key: 'actions', 
            label: 'Actions',
            render: (value: any, row: any) => (
                <div className="flex space-x-2">
                    <ButtonDefault 
                        label="Edit"
                        onClick={() => console.log('Edit user:', row.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    />
                    <ButtonDefault 
                        label="Delete"
                        onClick={() => console.log('Delete user:', row.id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    />
                </div>
            )
        }
    ];

    const rows = [
        { 
            id: 1, 
            name: 'John Doe', 
            email: 'john.doe@example.com', 
            role: 'Admin', 
            status: 'Active',
            lastLogin: '2024-01-15 14:30'
        },
        { 
            id: 2, 
            name: 'Jane Smith', 
            email: 'jane.smith@example.com', 
            role: 'Teacher', 
            status: 'Active',
            lastLogin: '2024-01-14 09:15'
        },
        { 
            id: 3, 
            name: 'Mike Johnson', 
            email: 'mike.johnson@example.com', 
            role: 'Student', 
            status: 'Inactive',
            lastLogin: '2024-01-10 16:45'
        },
        { 
            id: 4, 
            name: 'Sarah Wilson', 
            email: 'sarah.wilson@example.com', 
            role: 'Teacher', 
            status: 'Active',
            lastLogin: '2024-01-15 11:20'
        },
        { 
            id: 5, 
            name: 'David Brown', 
            email: 'david.brown@example.com', 
            role: 'Student', 
            status: 'Active',
            lastLogin: '2024-01-14 13:10'
        }
    ];

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
                        <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
                        <ButtonDefault 
                            label="Add New User"
                            onClick={() => console.log('Add new user')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        />
                    </div>
                </div>
                
                <TableDefault 
                    columns={columns} 
                    rows={rows}
                    className="rounded-b-lg"
                />
            </div>
        </div>
    );
};

export default UsersPage;