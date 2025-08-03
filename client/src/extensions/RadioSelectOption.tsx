'use client';

import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import ModalWindowDefault from '@/components/ModalWindows/ModalWindowDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

class RadioSelectOptionModule {
    quill: any;
    toolbar: any;

    constructor(quill: any) {
        this.quill = quill;
        this.toolbar = quill.getModule('toolbar');
        this.toolbar.addHandler('insertRadio', this.openDialog.bind(this));
    }

    openDialog() {
        const modalContainer = document.createElement('div');
        document.body.appendChild(modalContainer);

        const root: Root = createRoot(modalContainer);
        const cleanup = () => {
            root.unmount();
            document.body.removeChild(modalContainer);
        };

        root.render(<RadioDialog quill={this.quill} onClose={cleanup} />);
    }
}

const RadioDialog: React.FC<{ quill: any; onClose: () => void }> = ({ quill, onClose }) => {
    const [options, setOptions] = useState<string[]>(['', '']);
    const [correctIndex, setCorrectIndex] = useState(0);

    const addOption = () => setOptions(prev => [...prev, '']);
    const updateOption = (i: number, v: string) =>
        setOptions(prev => prev.map((o, idx) => (idx === i ? v : o)));

    const handleSubmit = () => {
        const sel = quill.getSelection(true);
        if (sel) {
            const name = `radio-${Date.now()}`;
            const html = `
        ${options
                    .map((opt, i) => {
                        const value = `option${i + 1}`;
                        return `
              <label>
                <input type="radio" name="${name}" value="${value}" />
                ${opt}
              </label>`;
                    })
                    .join('')}
      `;
            quill.insertEmbed(sel.index, 'radioBlock', html);
            quill.setSelection(sel.index + 1);
        }
        onClose();
    };

    return (
        <ModalWindowDefault isOpen onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Insert Select Option</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="correct"
                                checked={correctIndex === idx}
                                onChange={() => setCorrectIndex(idx)}
                                className="form-radio"
                            />
                            <input
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(idx, e.target.value)}
                                className="border border-gray-300 rounded p-1 flex-1"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <ButtonDefault label="+ Add option" onClick={addOption} color="neutral" />
                    <div className="space-x-2">
                        <ButtonDefault label="Cancel" onClick={onClose} color="red" />
                        <ButtonDefault label="Insert" onClick={handleSubmit} color="green" />
                    </div>
                </div>
            </div>
        </ModalWindowDefault>
    );
};

export default RadioSelectOptionModule;