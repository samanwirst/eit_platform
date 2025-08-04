'use client';

import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import ModalWindowDefault from '@/components/ModalWindows/ModalWindowDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

class TableInsertModule {
    quill: any;
    toolbar: any;

    constructor(quill: any) {
        this.quill = quill;
        this.toolbar = quill.getModule('toolbar');
        this.toolbar.addHandler('insertTable', this.openDialog.bind(this));
    }

    openDialog() {
        const modalContainer = document.createElement('div');
        document.body.appendChild(modalContainer);

        const root: Root = createRoot(modalContainer);
        const cleanup = () => {
            root.unmount();
            document.body.removeChild(modalContainer);
        };

        root.render(<TableDialog quill={this.quill} onClose={cleanup} />);
    }
}

const TableDialog: React.FC<{ quill: any; onClose: () => void }> = ({ quill, onClose }) => {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    const handleInsert = () => {
        const module = quill.getModule('better-table');
        if (module) {
            module.insertTable(rows, cols);
        }
        onClose();
    };

    return (
        <ModalWindowDefault isOpen onClose={onClose}>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Insert Table</h2>
                <div className="flex space-x-4">
                    <input
                        type="number"
                        value={rows}
                        onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                        min={1}
                        className="border border-gray-300 rounded p-1 w-20"
                        placeholder="Rows"
                    />
                    <input
                        type="number"
                        value={cols}
                        onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                        min={1}
                        className="border border-gray-300 rounded p-1 w-20"
                        placeholder="Cols"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <ButtonDefault label="Cancel" onClick={onClose} color="red" />
                    <ButtonDefault label="Insert" onClick={handleInsert} color="green" />
                </div>
            </div>
        </ModalWindowDefault>
    );
};

export default TableInsertModule;