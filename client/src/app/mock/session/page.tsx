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

    const readingEditorRefs = useRef<{ [key: string]: any }>({});
    const listeningEditorRef = useRef<any>(null);
    const writingEditorRefs = useRef<{ [key: string]: any }>({});

    // State for test results
    const [initialHTML, setInitialHTML] = useState<{ [key: string]: string }>({});
    const [testStartTime, setTestStartTime] = useState<Date | null>(null);

    // Function to create questions with embedded answer areas
    const createQuestionsWithAnswers = React.useCallback((questions: string[]): string => {
        let html = '';
        questions.forEach((question, index) => {
            html += `<div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
                <div class="question-text" style="font-weight: bold; color: #374151; margin-bottom: 10px; user-select: none; background-color: #f3f4f6; padding: 8px; border-radius: 4px; border: 1px solid #d1d5db;">
                    Question ${index + 1}: ${question}
                </div>
                <div class="answer-area" style="border: 2px dashed #d1d5db; padding: 10px; min-height: 50px; background-color: white; border-radius: 4px; margin-top: 10px;">
                    <span style="color: #9ca3af; font-style: italic;">Type your answer here...</span>
                </div>
            </div>`;
        });
        return html;
    }, []);

    // Memoized content for different sections
    const readingQuestions = React.useMemo(() => [
        "What is the main topic of the passage?",
        "According to the text, what are the key benefits mentioned?",
        "How does the author support their argument?",
        "What conclusion can be drawn from the information provided?",
        "What is the author's tone throughout the passage?",
        "Which statement best summarizes the passage?",
        "What evidence is provided to support the main claim?",
        "How does this information relate to current trends?",
        "What would be the most appropriate title for this passage?",
        "What implications does this have for the future?"
    ], []);

    const listeningQuestions = React.useMemo(() => [
        "What is the main topic of the conversation?",
        "Who are the speakers discussing?",
        "What is the speaker's opinion about the topic?",
        "What specific details are mentioned?",
        "What is the tone of the conversation?",
        "What conclusion can be drawn from the dialogue?",
        "What information is most important?",
        "How do the speakers feel about the situation?",
        "What would be the best summary of this conversation?",
        "What implications does this have?"
    ], []);

    const readingContent = React.useMemo(() => createQuestionsWithAnswers(readingQuestions), [createQuestionsWithAnswers, readingQuestions]);
    const listeningContent = React.useMemo(() => createQuestionsWithAnswers(listeningQuestions), [createQuestionsWithAnswers, listeningQuestions]);

    const writingTask1Content = React.useMemo(() => 
        `<div class="question-text" style="font-weight: bold; color: #374151; margin-bottom: 10px; user-select: none; background-color: #f3f4f6; padding: 8px; border-radius: 4px; border: 1px solid #d1d5db;">
            Task 1: Write a report describing the information shown in the chart/graph above. Write at least 150 words.
        </div>
        <div class="answer-area" style="border: 2px dashed #d1d5db; padding: 10px; min-height: 200px; background-color: white; border-radius: 4px; margin-top: 10px;">
            <span style="color: #9ca3af; font-style: italic;">Type your answer here...</span>
        </div>`, []);

    const writingTask2Content = React.useMemo(() => 
        `<div class="question-text" style="font-weight: bold; color: #374151; margin-bottom: 10px; user-select: none; background-color: #f3f4f6; padding: 8px; border-radius: 4px; border: 1px solid #d1d5db;">
            Task 2: Write an essay discussing the topic above. Give your opinion and support it with examples. Write at least 250 words.
        </div>
        <div class="answer-area" style="border: 2px dashed #d1d5db; padding: 10px; min-height: 300px; background-color: white; border-radius: 4px; margin-top: 10px;">
            <span style="color: #9ca3af; font-style: italic;">Type your answer here...</span>
        </div>`, []);

    const cleanContent = (content: string): string => {
        try {
            const deltaData = JSON.parse(content);
            if (deltaData.ops && Array.isArray(deltaData.ops)) {
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
                                        initialContent={readingContent}
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
                                    initialContent={listeningContent}
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
                                        initialContent={sectionKey === 'one' ? writingTask1Content : writingTask2Content}
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