'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { accessTestWithKey } from '@/utils/api';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import InputDefault from '@/components/Inputs/InputDefault';
import AlertDefault from '@/components/Alert/AlertDefault';

const MockPage = () => {
    const [testKey, setTestKey] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleStartTest = async () => {
        if (!testKey.trim()) {
            AlertDefault.warning('Please enter a test key');
            return;
        }

        setLoading(true);
        try {
            const response = await accessTestWithKey(testKey.trim());
            if (response.ok && response.test) {
                // Store test data in sessionStorage for the test session
                sessionStorage.setItem('currentTest', JSON.stringify(response.test));
                sessionStorage.setItem('testKey', testKey.trim());
                sessionStorage.setItem('testStartTime', new Date().toISOString());
                
                // Navigate to test session page
                router.push('/mock/session');
            } else {
                AlertDefault.error('Invalid test key or test not found');
            }
        } catch (error) {
            console.error('Error accessing test:', error);
            AlertDefault.error('Failed to access test. Please check your key and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">IELTS Mock Test</h1>
                <p className="text-gray-600">Enter your test key to start the exam</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Key
                    </label>
                    <InputDefault
                        type="text"
                        placeholder="Enter your test key (e.g., ABC12345)"
                        value={testKey}
                        onChange={(e) => setTestKey(e.target.value.toUpperCase())}
                        className="w-full text-center text-lg font-mono tracking-wider"
                        maxLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Enter the 8-character key provided by your instructor
                    </p>
                </div>

                <ButtonDefault
                    onClick={handleStartTest}
                    disabled={loading || !testKey.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Starting Test...' : 'Start Mock Test'}
                </ButtonDefault>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>Instructions:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>You will have access to Reading, Listening, and Writing sections</li>
                    <li>Complete all sections within the time limit</li>
                    <li>Do not switch tabs during the test</li>
                    <li>Your answers will be saved automatically</li>
                </ul>
            </div>
        </div>
    );
};

export default MockPage;
