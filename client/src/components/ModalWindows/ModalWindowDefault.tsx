'use client';

import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalWindowDefaultProps = {
    isOpen: boolean;
    onClose?: () => void;
    children: ReactNode;
    closeButton?: boolean;
    className?: string;
};

const ModalWindowDefault: React.FC<ModalWindowDefaultProps> = ({ 
    isOpen, 
    onClose = () => {}, 
    children, 
    closeButton = true,
    className = ""
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={closeButton ? onClose : undefined}
        >
            <div
                className={`bg-white text-black p-6 rounded-2xl shadow-xl max-w-md w-full ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default ModalWindowDefault;