'use client';

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';
import { radioIcon, tableIcon, selectOptionsIcon, checkBoxIcon, inputField } from './EditorIcons';

export type RichTextEditorHandle = {
  getContent: () => string;
  getContents: () => any;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      import('quill'),
      import('quill-better-table'),
      import('@/extensions/Modules/RadioSelectOptionModule'),
      import('@/extensions/Blots/RadioBlockBlot'),
      import('@/extensions/Modules/SelectOptionsModule'),
      import('@/extensions/Blots/SelectOptionsBlot'),
      import('@/extensions/Modules/TableInsertModule'),
      import('@/extensions/Modules/CheckboxSelectOptionModule'),
      import('@/extensions/Blots/CheckboxBlockBlot'),
      import('@/extensions/Modules/InputFieldInsertModule'),
      import('@/extensions/Blots/InputFieldBlockBlot'),
    ]).then(([QuillModule, QuillBetterTable, RadioSelectModule,
      RadioBlotModule, SelectOptionsModule, SelectOptionsBlot,
      TableInsertModule, CheckboxSelectOptionModule, CheckboxBlockBlot,
      InputFieldInsertModule, InputFieldBlockBlot
    ]) => {
      if (!mounted || !editorRef.current) return;

      const Quill = QuillModule.default;
      const Delta = Quill.import('delta');
      const icons = Quill.import('ui/icons');

      icons.insertRadio = radioIcon;
      icons.insertTable = tableIcon;
      icons.insertSelectOptions = selectOptionsIcon;
      icons.insertCheckbox = checkBoxIcon;
      icons.insertInputField = inputField;

      Quill.register('modules/insertRadio', RadioSelectModule.default);
      Quill.register(RadioBlotModule.RadioBlockBlot);
      Quill.register(
        {
        'modules/better-table': QuillBetterTable.default,
        'modules/insertTable': TableInsertModule.default,
      }, 
      true
    );
      Quill.register('modules/insertSelectOptions', SelectOptionsModule.default);
      Quill.register(SelectOptionsBlot.SelectOptionsBlot);
      Quill.register('modules/insertCheckbox', CheckboxSelectOptionModule.default);
      Quill.register(CheckboxBlockBlot.CheckboxBlockBlot);
      Quill.register('modules/insertInputField', InputFieldInsertModule.default);
      Quill.register(InputFieldBlockBlot.InputFieldBlockBlot);

      const quill = new Quill(editorRef.current!, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              ['blockquote', 'link', 'image', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
              [{ align: [] }],
              ['insertInputField', 'insertSelectOptions', 'insertRadio', 'insertCheckbox', 'insertTable'],
            ],
            handlers: {
              insertRadio() {
                const mod = quill.getModule('insertRadio');
                mod?.openDialog();
              },
              insertTable() {
                const mod = quill.getModule('insertTable');
                mod?.openDialog();
              },
              insertSelectOptions() {
                const mod = quill.getModule('insertSelectOptions');
                mod?.openDialog();
              },
              insertCheckbox() {
                const mod = quill.getModule('insertCheckbox');
                mod?.openDialog();
              },
              insertInputField() {
                const mod = quill.getModule('insertInputField');
                mod?.openDialog();
              },
            },
          },
          insertRadio: {},
          insertTable: {},
          insertSelectOptions: {},
          insertCheckbox: {},
          insertInputField: {},
          table: false,
          'better-table': {
            operationMenu: {
              items: {
                insertColumnRight: { text: 'Insert column right' },
                insertRowDown: { text: 'Insert row down' },
              },
            },
          },
          keyboard: {
            bindings: QuillBetterTable.default.keyboardBindings,
          },
        },
      });

      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        const el = node as HTMLElement;
        if (el.classList.contains('input-field-block')) {
          return new Delta().insert({
            inputFieldBlock: {
              values: JSON.parse(el.dataset.values || '[]'),
              example: el.dataset.example === 'true'
            }
          });
        }
        return delta;
      });

      quillRef.current = quill;
    });

    return () => {
      mounted = false;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getContent: () => quillRef.current?.root.innerHTML || '',
    getContents: () => quillRef.current?.getContents() || { ops: [] },
  }));

  return (
    <div
      ref={editorRef}
      className="h-80 border border-gray-300 rounded p-2"
    />
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default dynamic(() => Promise.resolve(RichTextEditor), {
  ssr: false,
});