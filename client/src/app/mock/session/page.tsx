'use client';

import React, { useState, useEffect, useRef } from 'react';
import AlertDefault from '@/components/Alert/AlertDefault';
import ReadOnlyRichTextEditor from '@/components/Editor/ReadOnlyRichTextEditor';
import { useTestSession } from '@/hooks/useTestSession';

interface TestData {
    _id: string;
    title: string;
    reading: {
        sections: {
            one: { title: string; content: string; files: string[] };
            two: { title: string; content: string; files: string[] };
            three: { title: string; content: string; files: string[] };
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

    const readingEditorRefs = useRef<{ [key: string]: any }>({});
    const listeningEditorRef = useRef<any>(null);
    const writingEditorRefs = useRef<{ [key: string]: any }>({});

    // State for test results
    const [initialHTML, setInitialHTML] = useState<{ [key: string]: string }>({});
    const [testStartTime, setTestStartTime] = useState<Date | null>(null);

    const cleanContent = (content: string | null | undefined): string => {
        // Handle null, undefined, or empty content
        if (!content || typeof content !== 'string') {
            return '';
        }
        
        // If content is already HTML, return as is
        if (content.includes('<') && content.includes('>')) {
            return content;
        }
        
        try {
            const deltaData = JSON.parse(content);
            if (deltaData.ops && Array.isArray(deltaData.ops)) {
                let html = '';
                let inTable = false;
                let tableRows: string[] = [];
                let currentRow: string[] = [];
                
                deltaData.ops.forEach((op: any) => {
                    if (op.insert) {
                        if (typeof op.insert === 'string') {
                            // Handle text with formatting
                            let text = op.insert;
                            
                            // Handle table cells
                            if (op.attributes && op.attributes['table-cell-line']) {
                                if (!inTable) {
                                    html += '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
                                    inTable = true;
                                }
                                
                                // Add cell content
                                currentRow.push(`<td style="padding: 8px; border: 1px solid #ccc;">${text}</td>`);
                                
                                // Check if this is the end of a row
                                if (text.includes('\n') || op.attributes['table-cell-line'].row !== currentRow[0]?.match(/row-\w+/)?.[0]) {
                                    if (currentRow.length > 0) {
                                        tableRows.push(`<tr>${currentRow.join('')}</tr>`);
                                        currentRow = [];
                                    }
                                }
                            } else {
                                // Close table if we were in one
                                if (inTable) {
                                    if (currentRow.length > 0) {
                                        tableRows.push(`<tr>${currentRow.join('')}</tr>`);
                                    }
                                    html += tableRows.join('') + '</table>';
                                    inTable = false;
                                    tableRows = [];
                                    currentRow = [];
                                }
                                
                                // Handle regular text formatting
                                if (op.attributes) {
                                    if (op.attributes.bold) text = `<strong>${text}</strong>`;
                                    if (op.attributes.italic) text = `<em>${text}</em>`;
                                    if (op.attributes.underline) text = `<u>${text}</u>`;
                                    if (op.attributes.header) {
                                        const level = op.attributes.header;
                                        text = `<h${level}>${text}</h${level}>`;
                                    }
                                }
                                html += text;
                            }
                        } else if (op.insert.text) {
                            html += op.insert.text;
                        }
                    }
                });
                
                // Close any remaining table
                if (inTable) {
                    if (currentRow.length > 0) {
                        tableRows.push(`<tr>${currentRow.join('')}</tr>`);
                    }
                    html += tableRows.join('') + '</table>';
                }
                
                return html.replace(/\n/g, '<br>');
            }
        } catch (e) {
            // If parsing fails, return the content as is
            console.warn('Failed to parse content:', e);
        }
        return content;
    };

    // Function to save initial HTML when test starts
    const saveInitialHTML = () => {
        if (!sessionData) return;
        
        const initialHTMLs: { [key: string]: string } = {};
        
        // Save reading sections
        Object.keys(sessionData.testData.reading.sections).forEach(sectionKey => {
            const editorRef = readingEditorRefs.current[`reading_${sectionKey}`];
            if (editorRef) {
                initialHTMLs[`reading_${sectionKey}`] = editorRef.getContent();
            }
        });
        
        // Save listening section
        if (listeningEditorRef.current) {
            initialHTMLs['listening'] = listeningEditorRef.current.getContent();
        }
        
        // Save writing sections
        Object.keys(sessionData.testData.writing.sections).forEach(sectionKey => {
            const editorRef = writingEditorRefs.current[`writing_${sectionKey}`];
            if (editorRef) {
                initialHTMLs[`writing_${sectionKey}`] = editorRef.getContent();
            }
        });
        
        setInitialHTML(initialHTMLs);
        localStorage.setItem('initialHTML', JSON.stringify(initialHTMLs));
    };

    // Function to save final HTML and compare
    const saveFinalHTMLAndCompare = () => {
        if (!sessionData) return;
        
        const finalHTMLs: { [key: string]: string } = {};
        
        // Get final HTML from all editors
        Object.keys(sessionData.testData.reading.sections).forEach(sectionKey => {
            const editorRef = readingEditorRefs.current[`reading_${sectionKey}`];
            if (editorRef) {
                finalHTMLs[`reading_${sectionKey}`] = editorRef.getContent();
            }
        });
        
        if (listeningEditorRef.current) {
            finalHTMLs['listening'] = listeningEditorRef.current.getContent();
        }
        
        Object.keys(sessionData.testData.writing.sections).forEach(sectionKey => {
            const editorRef = writingEditorRefs.current[`writing_${sectionKey}`];
            if (editorRef) {
                finalHTMLs[`writing_${sectionKey}`] = editorRef.getContent();
            }
        });
        
        // Calculate test duration
        const endTime = new Date();
        const duration = testStartTime ? Math.round((endTime.getTime() - testStartTime.getTime()) / 1000) : 0;
        
        // Save test results
        const testResult = {
            testId: sessionData.testData._id,
            testTitle: sessionData.testData.title,
            testKey: sessionData.testKey,
            startTime: testStartTime?.toISOString(),
            endTime: endTime.toISOString(),
            duration: duration,
            initialHTML: initialHTML,
            finalHTML: finalHTMLs,
            completedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]');
        existingResults.push(testResult);
        localStorage.setItem('testResults', JSON.stringify(existingResults));
        
        return testResult;
    };

    useEffect(() => {
        const data = initializeSession();
        if (!data) return;

        // Set test start time
        setTestStartTime(new Date());
        
        startTimer(finishSession);
        const cleanupTabDetection = setupTabDetection();

        return () => {
            cleanup();
            cleanupTabDetection();
        };
    }, []);

    // Save initial HTML after editors are loaded
    useEffect(() => {
        if (sessionData && Object.keys(readingEditorRefs.current).length > 0) {
            // Wait a bit for editors to be fully initialized
            setTimeout(() => {
                saveInitialHTML();
            }, 1000);
        }
    }, [sessionData]);

    // Custom finish session function that saves results
    const handleFinishSession = () => {
        // Save final HTML and compare
        const testResult = saveFinalHTMLAndCompare();
        
        // Call original finish session
        finishSession();
        
        // Show success message with test result
        if (testResult) {
            AlertDefault.success(`Test completed! Duration: ${Math.floor(testResult.duration / 60)} minutes ${testResult.duration % 60} seconds`);
        }
    };

    // Auto-save answers every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (sessionData) {
                // Save all current answers to session storage
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
                                onClick={handleFinishSession}
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentSection === 'reading' && (
                    <div className="space-y-8">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                            <h2 className="text-2xl font-bold text-blue-900">Reading Section</h2>
                            <p className="text-blue-700 mt-1">Read the passages below and answer the questions. Each section has 10 questions.</p>
                        </div>
                        {Object.entries(testData.reading.sections)
                            .filter(([sectionKey]) => ['one', 'two', 'three'].includes(sectionKey))
                            .map(([sectionKey, section]) => (
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
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                        <label className="block text-sm font-medium text-yellow-800 mb-2">
                                            📝 Answer the questions below:
                                        </label>
                                        <p className="text-xs text-yellow-700">Read the questions and type your answers directly in the editor below. Questions are read-only.</p>
                                    </div>
                                    <ReadOnlyRichTextEditor
                                        ref={(ref) => {
                                            if (ref) {
                                                readingEditorRefs.current[`reading_${sectionKey}`] = ref;
                                            }
                                        }}
                                        initialContent=""
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {currentSection === 'listening' && (
                    <div className="space-y-8">
                        <div className="bg-green-50 border-l-4 border-green-400 p-4">
                            <h2 className="text-2xl font-bold text-green-900">Listening Section</h2>
                            <p className="text-green-700 mt-1">Listen to the audio and answer the questions below. There are 10 questions total.</p>
                        </div>
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
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <label className="block text-sm font-medium text-yellow-800 mb-2">
                                        📝 Answer the questions below:
                                    </label>
                                    <p className="text-xs text-yellow-700">Listen to the audio and type your answers directly in the editor below. Questions are read-only.</p>
                                </div>
                                <ReadOnlyRichTextEditor
                                    ref={listeningEditorRef}
                                    initialContent=""
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentSection === 'writing' && (
                    <div className="space-y-8">
                        <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                            <h2 className="text-2xl font-bold text-purple-900">Writing Section</h2>
                            <p className="text-purple-700 mt-1">Write your responses in the text editor below. Use the rich text formatting tools as needed.</p>
                        </div>
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
                                    <ReadOnlyRichTextEditor
                                        ref={(ref) => {
                                            if (ref) {
                                                writingEditorRefs.current[`writing_${sectionKey}`] = ref;
                                            }
                                        }}
                                        initialContent=""
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