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
import { radioIcon, tableIcon } from './EditorIcons';

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
      import('@/extensions/TableInsertModule'),
    ]).then(([QuillModule, QuillBetterTable, RadioSelectModule, RadioBlotModule, TableInsertModule]) => {
      if (!mounted || !editorRef.current) return;

      const Quill = QuillModule.default;
      const Delta = Quill.import('delta');
      const icons = Quill.import('ui/icons');

      icons.insertRadio = radioIcon;
      icons.insertTable = tableIcon;

      Quill.register('modules/insertRadio', RadioSelectModule.default);
      Quill.register(RadioBlotModule.RadioBlockBlot);
      Quill.register(
        {
          'modules/better-table': QuillBetterTable.default,
          'modules/insertTable': TableInsertModule.default,
        },
        true
      );

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
              ['insertRadio', 'insertTable'],
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
            },
          },
          insertRadio: {},
          insertTable: {},
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