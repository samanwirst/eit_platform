'use client';

import React, { useState, useEffect } from 'react';
import { getAccessToken } from '@/lib/auth';
import { createKey, getUsers, getTests, User, Test } from '@/utils/api';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import ModalWindowDefault from '@/components/ModalWindows/ModalWindowDefault';
import AlertDefault from '@/components/Alert/AlertDefault';

const KeysPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [generatedKey, setGeneratedKey] = useState<string>('');
    const [formData, setFormData] = useState({
        userId: '',
        testId: ''
    });

    const token = getAccessToken();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (!token) return;
        
        try {
            const [usersResponse, testsResponse] = await Promise.all([
                getUsers(token),
                getTests(token)
            ]);

            setUsers(usersResponse?.users || usersResponse || []);
            setTests(testsResponse?.tests || testsResponse || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!token || !formData.userId || !formData.testId) return;

        try {
            const response = await createKey(formData, token);
            setIsCreateModalOpen(false);
            setFormData({ userId: '', testId: '' });
            
            // Show the generated key in a modal
            if (response?.key) {
                setGeneratedKey(response.key);
                setIsKeyModalOpen(true);
                AlertDefault.success('Key generated successfully!');
            } else {
                AlertDefault.success('Key generated successfully!');
            }
        } catch (error) {
            console.error('Error creating key:', error);
            AlertDefault.error('Failed to generate key. Please try again.');
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Keys Management</h1>
                <ButtonDefault
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Generate a key
                </ButtonDefault>
            </div>

            {/* Create Key Modal */}
            <ModalWindowDefault
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Generate a Key</h2>
                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Student</label>
                        <select
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Choose a student...</option>
                            {users.filter(user => user.role === 'user').map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.firstName} {user.lastName} ({user.phoneNumber})
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Found {users.filter(user => user.role === 'user').length} students
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Select Test</label>
                        <select
                            value={formData.testId}
                            onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Choose a test...</option>
                            {tests.map(test => (
                                <option key={test._id} value={test._id}>
                                    {test.title}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Found {tests.length} tests
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <ButtonDefault
                            onClick={() => setIsCreateModalOpen(false)}
                            className="bg-gray-500 hover:bg-gray-600"
                        >
                            Cancel
                        </ButtonDefault>
                        <ButtonDefault
                            onClick={handleCreateKey}
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={!formData.userId || !formData.testId}
                        >
                            Generate Key
                        </ButtonDefault>
                    </div>
                    </div>
                </div>
            </ModalWindowDefault>

            {/* Generated Key Modal */}
            <ModalWindowDefault
                isOpen={isKeyModalOpen}
                onClose={() => setIsKeyModalOpen(false)}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Generated Key</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Access Key:</p>
                            <p className="text-2xl font-mono font-bold text-center bg-white p-3 rounded border">
                                {generatedKey}
                            </p>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p><strong>Important:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Share this key with the student</li>
                                <li>Students can use this key to access the test</li>
                                <li>This key can only be used once</li>
                                <li>The key will be deleted after the student accesses the test</li>
                            </ul>
                        </div>
                        <div className="flex justify-end">
                            <ButtonDefault
                                onClick={() => setIsKeyModalOpen(false)}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Close
                            </ButtonDefault>
                        </div>
                    </div>
                </div>
            </ModalWindowDefault>
        </div>
    );
};

export default KeysPage;
