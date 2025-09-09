'use client';

import React, { useState, useEffect, useRef } from 'react';
import AlertDefault from '@/components/Alert/AlertDefault';
import RichTextEditor from '@/components/Editor/RichTextEditor';
import { useTestSession } from '@/hooks/useTestSession';

interface TestData {
    _id: string;
    title: string;
    reading: {
        sections: {
            one: { title: string; content: string; files: string[] };
            two: { title: string; content: string; files: string[] };
            three: { title: string; content: string; files: string[] };
            four: { title: string; content: string; files: string[] };
        };
    };
    listening: {
        content: string;
        files: string[];
    };
    writing: {
        sections: {
            one: { title: string; content: string; files: string[] };
            two: { title: string; content: string; files: string[] };
        };
    };
}

const TestSessionPage = () => {
    const [currentSection, setCurrentSection] = useState<'reading' | 'listening' | 'writing'>('reading');
    const { 
        sessionData, 
        isBlurred, 
        initializeSession, 
        startTimer, 
        setupTabDetection, 
        updateAnswer, 
        finishSession, 
        formatTime, 
        cleanup 
    } = useTestSession();

    // Refs for RichTextEditor components
    const readingEditorRefs = useRef<{ [key: string]: any }>({});
    const listeningEditorRef = useRef<any>(null);
    const writingEditorRefs = useRef<{ [key: string]: any }>({});

    // Function to clean Delta format content and convert to HTML
    const cleanContent = (content: string): string => {
        try {
            // Check if it's Delta format
            const deltaData = JSON.parse(content);
            if (deltaData.ops && Array.isArray(deltaData.ops)) {
                // Convert Delta to HTML
                let html = '';
                deltaData.ops.forEach((op: any) => {
                    if (op.insert) {
                        if (typeof op.insert === 'string') {
                            html += op.insert;
                        } else if (op.insert.text) {
                            html += op.insert.text;
                        }
                    }
                });
                return html.replace(/\n/g, '<br>');
            }
        } catch (e) {
            // If it's not JSON, return as is
        }
        return content;
    };

    // Function to handle answer updates
    const handleAnswerUpdate = (sectionId: string) => {
        const editorRef = readingEditorRefs.current[sectionId] || 
                         listeningEditorRef.current || 
                         writingEditorRefs.current[sectionId];
        
        if (editorRef) {
            const content = editorRef.getContent();
            updateAnswer(sectionId, content);
        }
    };

    useEffect(() => {
        const data = initializeSession();
        if (!data) return;

        startTimer(finishSession);
        const cleanupTabDetection = setupTabDetection();

        return () => {
            cleanup();
            cleanupTabDetection();
        };
    }, []);

    // Auto-save answers every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (sessionData) {
                // Save all current answers
                Object.keys(readingEditorRefs.current).forEach(key => {
                    const editor = readingEditorRefs.current[key];
                    if (editor) {
                        const content = editor.getContent();
                        updateAnswer(key, content);
                    }
                });

                if (listeningEditorRef.current) {
                    const content = listeningEditorRef.current.getContent();
                    updateAnswer('listening', content);
                }

                Object.keys(writingEditorRefs.current).forEach(key => {
                    const editor = writingEditorRefs.current[key];
                    if (editor) {
                        const content = editor.getContent();
                        updateAnswer(key, content);
                    }
                });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [sessionData, updateAnswer]);

    if (!sessionData) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading test...</p>
            </div>
        );
    }

    if (isBlurred) {
        return (
            <div className="min-h-screen bg-red-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Tab Switch Detected</h1>
                    <p className="text-gray-700 mb-4">You are not allowed to switch tabs during the test.</p>
                    <p className="text-sm text-gray-500">Please return to the test tab to continue.</p>
                </div>
            </div>
        );
    }

    const testData = sessionData.testData as TestData;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">{testData.title}</h1>
                            <p className="text-sm text-gray-600">IELTS Mock Test</p>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Time Remaining</div>
                                <div className={`text-lg font-mono font-bold ${sessionData.timeRemaining < 1800 ? 'text-red-600' : 'text-gray-900'}`}>
                                    {formatTime(sessionData.timeRemaining)}
                                </div>
                            </div>
                            <button
                                onClick={finishSession}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Finish Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {(['reading', 'listening', 'writing'] as const).map((section) => (
                            <button
                                key={section}
                                onClick={() => setCurrentSection(section)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                    currentSection === section
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {section}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentSection === 'reading' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">Reading Section</h2>
                        {Object.entries(testData.reading.sections).map(([sectionKey, section]) => (
                            <div key={sectionKey} className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                                <div 
                                    className="prose max-w-none mb-6"
                                    dangerouslySetInnerHTML={{ __html: cleanContent(section.content) }}
                                />
                                {section.files.map((file, index) => (
                                    <div key={index} className="mb-4">
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${file}`} 
                                            alt={`Reading ${sectionKey} file ${index + 1}`}
                                            className="max-w-full h-auto rounded border"
                                        />
                                    </div>
                                ))}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Answer:
                                    </label>
                                    <RichTextEditor
                                        ref={(ref) => {
                                            if (ref) {
                                                readingEditorRefs.current[`reading_${sectionKey}`] = ref;
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {currentSection === 'listening' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">Listening Section</h2>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div 
                                className="prose max-w-none mb-6"
                                dangerouslySetInnerHTML={{ __html: cleanContent(testData.listening.content) }}
                            />
                            {testData.listening.files.map((file, index) => (
                                <div key={index} className="mb-4">
                                    <audio 
                                        controls 
                                        className="w-full"
                                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${file}`}
                                    >
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            ))}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Answer:
                                </label>
                                <RichTextEditor
                                    ref={listeningEditorRef}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentSection === 'writing' && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">Writing Section</h2>
                        {Object.entries(testData.writing.sections).map(([sectionKey, section]) => (
                            <div key={sectionKey} className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                                <div 
                                    className="prose max-w-none mb-6"
                                    dangerouslySetInnerHTML={{ __html: cleanContent(section.content) }}
                                />
                                {section.files.map((file, index) => (
                                    <div key={index} className="mb-4">
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${file}`} 
                                            alt={`Writing ${sectionKey} file ${index + 1}`}
                                            className="max-w-full h-auto rounded border"
                                        />
                                    </div>
                                ))}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Answer:
                                    </label>
                                    <RichTextEditor
                                        ref={(ref) => {
                                            if (ref) {
                                                writingEditorRefs.current[`writing_${sectionKey}`] = ref;
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestSessionPage;