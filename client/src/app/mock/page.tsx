'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { accessTestWithKey } from '@/utils/api';
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import InputDefault from '@/components/Inputs/InputDefault';
import AlertDefault from '@/components/Alert/AlertDefault';
import TableDefault from '@/components/Tables/TableDefault';

const MockPage = () => {
    const [testKey, setTestKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [completedTests, setCompletedTests] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();

    // Load completed tests from localStorage
    useEffect(() => {
        const savedResults = localStorage.getItem('testResults');
        if (savedResults) {
            try {
                const results = JSON.parse(savedResults);
                setCompletedTests(results);
            } catch (error) {
                console.error('Error loading test results:', error);
            }
        }
    }, []);

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

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const deleteTestResult = (index: number) => {
        const updatedResults = completedTests.filter((_, i) => i !== index);
        setCompletedTests(updatedResults);
        localStorage.setItem('testResults', JSON.stringify(updatedResults));
        AlertDefault.success('Test result deleted successfully');
    };

    const tableColumns = [
        { key: 'testTitle', label: 'Test Name' },
        { key: 'completedAt', label: 'Completed' },
        { key: 'duration', label: 'Duration' },
        { key: 'actions', label: 'Actions' }
    ];

    const tableRows = completedTests.map((test, index) => ({
        testTitle: test.testTitle,
        completedAt: formatDate(test.completedAt),
        duration: formatDuration(test.duration),
        actions: (
            <div className="flex space-x-2">
                <button
                    onClick={() => {
                        // TODO: Show detailed results
                        AlertDefault.info('Detailed results view coming soon!');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                >
                    View
                </button>
                <button
                    onClick={() => deleteTestResult(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                >
                    Delete
                </button>
            </div>
        )
    }));

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">IELTS Mock Test</h1>
                <p className="text-gray-600">Enter your test key to start the exam</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Start Test Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Start New Test</h2>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Test Key
                        </label>
                        <InputDefault
                            type="text"
                            placeholder="Enter your test key (e.g., ABC12345)"
                            value={testKey}
                            onChange={(e) => setTestKey(e.target.value.toUpperCase())}
                            //@ts-ignore
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

                    <div className="mt-6 text-sm text-gray-500">
                        <p className="font-medium mb-2">Instructions:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>You will have access to Reading, Listening, and Writing sections</li>
                            <li>Complete all sections within the time limit</li>
                            <li>Do not switch tabs during the test</li>
                            <li>Your answers will be saved automatically</li>
                        </ul>
                    </div>
                </div>

                {/* Test Results Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Test Results</h2>
                        <span className="text-sm text-gray-500">
                            {completedTests.length} completed test{completedTests.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    
                    {completedTests.length > 0 ? (
                        <TableDefault
                            columns={tableColumns}
                            rows={tableRows}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No completed tests yet.</p>
                            <p className="text-sm mt-1">Complete a test to see your results here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockPage;
