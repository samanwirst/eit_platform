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
import { radioIcon, tableIcon, selectOptionsIcon, checkBoxIcon } from './EditorIcons';

export type RichTextEditorHandle = {
  getContent: () => string;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      import('quill'),
      import('quill-better-table'),
      import('@/extensions/RadioSelectOptionModule'),
      import('@/extensions/RadioBlockBlot'),
      import('@/extensions/SelectOptionsModule'),
      import('@/extensions/SelectOptionsBlot'),
      import('@/extensions/TableInsertModule'),
      import('@/extensions/CheckboxSelectOptionModule'),
      import('@/extensions/CheckboxBlockBlot'),
    ]).then(([QuillModule, QuillBetterTable, RadioSelectModule, RadioBlotModule, SelectOptionsModule, SelectOptionsBlot, TableInsertModule, CheckboxSelectOptionModule, CheckboxBlockBlot]) => {
      if (!mounted || !editorRef.current) return;

      const Quill = QuillModule.default;
      const Delta = Quill.import('delta');
      const icons = Quill.import('ui/icons');

      icons.insertRadio = radioIcon;
      icons.insertTable = tableIcon;
      icons.insertSelectOptions = selectOptionsIcon;
      icons.insertCheckbox = checkBoxIcon;

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
              ['insertSelectOptions', 'insertRadio', 'insertCheckbox', 'insertTable'],
            ],
            handlers: {
              insertRadio() {
                const mod = quill.getModule('insertRadio');
                if (mod?.openDialog) mod.openDialog();
              },
              insertTable() {
                const mod = quill.getModule('insertTable');
                if (mod?.openDialog) mod.openDialog();
              },
              insertSelectOptions() {
                const mod = quill.getModule('insertSelectOptions');
                if (mod?.openDialog) mod.openDialog();
              },
              insertCheckbox() {
                const mod = quill.getModule('insertCheckbox');
                if (mod?.openDialog) mod.openDialog();
              },
            },
          },
          insertRadio: {},
          insertTable: {},
          insertSelectOptions: {},
          insertCheckbox: {},
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
        if (el.classList.contains('radio-block')) {
          return new Delta().insert({ radioBlock: el.innerHTML });
        } else if (el.classList.contains('select-options-block')) {
          return new Delta().insert({ selectOptions: el.innerHTML });
        } else if (el.classList.contains('checkbox-block')) {
          return new Delta().insert({ checkboxBlock: el.innerHTML });
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
    getContent: () => {
      if (quillRef.current) {
        return quillRef.current.root.innerHTML;
      }
      return '';
    },
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