'use client';

import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import ModalWindowDefault from '@/components/ModalWindows/ModalWindowDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

class InputFieldInsertModule {
    quill: any;
    toolbar: any;

    constructor(quill: any) {
        this.quill = quill;
        this.toolbar = quill.getModule('toolbar');
        this.toolbar.addHandler('insertInputField', this.openDialog.bind(this));
    }

    openDialog() {
        const modalContainer = document.createElement('div');
        document.body.appendChild(modalContainer);

        const root: Root = createRoot(modalContainer);
        const cleanup = () => {
            root.unmount();
            document.body.removeChild(modalContainer);
        };

        root.render(<InputFieldDialog quill={this.quill} onClose={cleanup} />);
    }
}

const InputFieldDialog: React.FC<{ quill: any; onClose: () => void }> = ({ quill, onClose }) => {
    const [values, setValues] = useState<string[]>(['']);
    const [example, setExample] = useState(false);

    const updateValue = (i: number, v: string) => {
        setValues(prev => prev.map((val, idx) => idx === i ? v : val));
    };

    const addValue = () => setValues(prev => [...prev, '']);
    const removeValue = (i: number) => {
        if (values.length > 1) {
            setValues(prev => prev.filter((_, idx) => idx !== i));
        }
    };

    const handleInsert = () => {
        const sel = quill.getSelection(true);
        if (sel) {
            const data = { values, example };
            quill.insertEmbed(sel.index, 'inputFieldBlock', data);
            quill.setSelection(sel.index + 1);
        }
        onClose();
    };

    return (
        <ModalWindowDefault isOpen onClose={onClose}>
            <div className="space-y-4 w-96">
                <h2 className="text-xl font-semibold">Insert Input Field</h2>
                <p className="text-sm text-gray-500">Define the values for each input field.</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {values.map((val, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder={`Value`}
                                value={val}
                                onChange={(e) => updateValue(idx, e.target.value)}
                                className="border border-gray-300 rounded p-1 flex-1"
                            />
                            {values.length > 1 && (
                                <button
                                    onClick={() => removeValue(idx)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <ButtonDefault label="Additional value" onClick={addValue} color="neutral" />

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={example}
                        onChange={() => setExample(prev => !prev)}
                        className="form-checkbox"
                    />
                    <label>Example value</label>
                </div>

                <div className="flex justify-end space-x-2">
                    <ButtonDefault label="Cancel" onClick={onClose} color="red" />
                    <ButtonDefault label="Insert" onClick={handleInsert} color="green" />
                </div>
            </div>
        </ModalWindowDefault>
    );
};

export default InputFieldInsertModule;