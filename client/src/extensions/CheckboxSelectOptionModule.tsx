'use client';

import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import ModalWindowDefault from '@/components/ModalWindows/ModalWindowDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

class CheckboxSelectOptionModule {
    quill: any;
    toolbar: any;

    constructor(quill: any) {
        this.quill = quill;
        this.toolbar = quill.getModule('toolbar');
    }

    openDialog() {
        const modalContainer = document.createElement('div');
        document.body.appendChild(modalContainer);

        const root: Root = createRoot(modalContainer);
        const cleanup = () => {
            root.unmount();
            document.body.removeChild(modalContainer);
        };

        root.render(<CheckboxDialog quill={this.quill} onClose={cleanup} />);
    }
}

const CheckboxDialog: React.FC<{ quill: any; onClose: () => void }> = ({ quill, onClose }) => {
    const [options, setOptions] = useState<string[]>(['', '']);
    const [correctIndexes, setCorrectIndexes] = useState<number[]>([]);

    const addOption = () => setOptions(prev => [...prev, '']);
    const updateOption = (i: number, v: string) =>
        setOptions(prev => prev.map((o, idx) => (idx === i ? v : o)));

    const toggleCorrect = (i: number) => {
        setCorrectIndexes(prev =>
            prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]
        );
    };

    const handleSubmit = () => {
        const sel = quill.getSelection(true);
        if (sel) {
            const name = `checkbox-${Date.now()}`;
            const html = `
        ${options
                    .map((opt, i) => {
                        const value = `option${i + 1}`;
                        const checked = correctIndexes.includes(i) ? 'checked' : '';
                        return `
              <label>
                <input type="checkbox" name="${name}" value="${value}" ${checked}/>
                <span>${opt}</span>
              </label>`;
                    })
                    .join('')}
      `;
            quill.insertEmbed(sel.index, 'checkboxBlock', html);
            quill.setSelection(sel.index + 1);
        }
        onClose();
    };

    return (
        <ModalWindowDefault isOpen onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Insert Checkbox Options</h2>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={correctIndexes.includes(idx)}
                                onChange={() => toggleCorrect(idx)}
                                className="form-checkbox"
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

export default CheckboxSelectOptionModule;
