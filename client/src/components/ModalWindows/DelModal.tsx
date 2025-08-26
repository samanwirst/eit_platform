'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

type DelModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
};

const DelModal: React.FC<DelModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Delete", 
    cancelText = "Cancel" 
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white text-black p-6 rounded-2xl shadow-xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-between gap-x-3">
                    <ButtonDefault 
                        label={cancelText}
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    />
                    <ButtonDefault 
                        label={confirmText}
                        onClick={onConfirm}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DelModal;
