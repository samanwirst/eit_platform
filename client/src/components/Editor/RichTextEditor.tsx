'use client';

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';

export type RichTextEditorHandle = {
  getContent: () => string;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    import('quill').then((QuillModule) => {
      if (!mounted || quillRef.current || !editorRef.current) return;

      const Quill = QuillModule.default;

      quillRef.current = new Quill(editorRef.current!, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image'],
            ['insertInput', 'insertSelect', 'insertRadio', 'insertCheckbox', 'insertTable'],
            ['clean'],
          ],
        },
        placeholder: 'Write something...',
      });
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