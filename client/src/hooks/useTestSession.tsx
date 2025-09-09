'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AlertDefault from '@/components/Alert/AlertDefault';

interface SessionData {
    testData: any;
    testKey: string;
    startTime: string;
    answers: Record<string, string>;
    timeRemaining: number;
}

export const useTestSession = () => {
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [isBlurred, setIsBlurred] = useState(false);
    const router = useRouter();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const initializeSession = () => {
        const storedTest = sessionStorage.getItem('currentTest');
        const storedKey = sessionStorage.getItem('testKey');
        const storedStartTime = sessionStorage.getItem('testStartTime');
        const storedAnswers = sessionStorage.getItem('testAnswers');
        const storedTime = sessionStorage.getItem('testTimeRemaining');

        if (!storedTest || !storedKey) {
            AlertDefault.error('No test session found. Please start from the Mock page.');
            router.push('/mock');
            return null;
        }

        try {
            const testData = JSON.parse(storedTest);
            const answers = storedAnswers ? JSON.parse(storedAnswers) : {};
            const timeRemaining = storedTime ? parseInt(storedTime) : 180 * 60;


            const data: SessionData = {
                testData,
                testKey: storedKey,
                startTime: storedStartTime || new Date().toISOString(),
                answers,
                timeRemaining
            };

            setSessionData(data);
            return data;
        } catch (error) {
            console.error('Error initializing session:', error);
            AlertDefault.error('Error loading test session');
            router.push('/mock');
            return null;
        }
    };

    const startTimer = (onTimeUp: () => void) => {
        intervalRef.current = setInterval(() => {
            setSessionData(prev => {
                if (!prev) return prev;
                
                const newTime = prev.timeRemaining - 1;
                sessionStorage.setItem('testTimeRemaining', newTime.toString());
                
                if (newTime <= 0) {
                    onTimeUp();
                    return { ...prev, timeRemaining: 0 };
                }
                return { ...prev, timeRemaining: newTime };
            });
        }, 1000);
    };

    const setupTabDetection = () => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsBlurred(true);
                blurTimeoutRef.current = setTimeout(() => {
                    AlertDefault.warning('You switched tabs! This is not allowed during the test.');
                    router.push('/mock/blur');
                }, 1000);
            } else {
                setIsBlurred(false);
                if (blurTimeoutRef.current) {
                    clearTimeout(blurTimeoutRef.current);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    const updateAnswer = (sectionId: string, content: string) => {
        if (!sessionData) return;

        const newAnswers = { ...sessionData.answers, [sectionId]: content };
        setSessionData(prev => prev ? { ...prev, answers: newAnswers } : null);
        sessionStorage.setItem('testAnswers', JSON.stringify(newAnswers));
    };

    const finishSession = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }

        if (sessionData) {
            sessionStorage.setItem('finalTestAnswers', JSON.stringify(sessionData.answers));
            sessionStorage.setItem('testEndTime', new Date().toISOString());
        }

        sessionStorage.removeItem('currentTest');
        sessionStorage.removeItem('testKey');
        sessionStorage.removeItem('testStartTime');
        sessionStorage.removeItem('testAnswers');
        sessionStorage.removeItem('testTimeRemaining');

        AlertDefault.success('Test completed! Your answers have been saved.');
        router.push('/');
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const cleanup = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }
    };

    return {
        sessionData,
        isBlurred,
        initializeSession,
        startTimer,
        setupTabDetection,
        updateAnswer,
        finishSession,
        formatTime,
        cleanup
    };
};
