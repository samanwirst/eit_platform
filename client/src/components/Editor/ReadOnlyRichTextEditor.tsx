'use client';

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';

export type ReadOnlyRichTextEditorHandle = {
  getContent: () => string;
  getContents: () => any;
  setContent: (content: string) => void;
};

interface ReadOnlyRichTextEditorProps {
  initialContent?: string;
}

const ReadOnlyRichTextEditor = forwardRef<ReadOnlyRichTextEditorHandle, ReadOnlyRichTextEditorProps>(({ 
  initialContent = ''
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    import('quill').then((QuillModule) => {
      if (!mounted || !editorRef.current) return;

      const Quill = QuillModule.default;

      const quill = new Quill(editorRef.current!, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            ['blockquote', 'link', 'image', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
          ],
        },
      });

      // Set initial content
      if (initialContent) {
        quill.root.innerHTML = initialContent;
      }

      // Make read-only sections non-editable
      const makeReadOnly = () => {
        const sections = ['.question-text'];
        sections.forEach(selector => {
          const elements = quill.root.querySelectorAll(selector);
          elements.forEach((element: any) => {
            element.contentEditable = 'false';
            element.style.userSelect = 'none';
            element.style.cursor = 'default';
            element.style.backgroundColor = '#f9fafb';
            element.style.border = '1px solid #e5e7eb';
            element.style.borderRadius = '4px';
            element.style.padding = '8px';
          });
        });
      };

      // Apply read-only styling after content is set
      setTimeout(makeReadOnly, 100);

      // Reapply read-only styling on content changes
      quill.on('text-change', makeReadOnly);

      quillRef.current = quill;
    });

    return () => {
      mounted = false;
    };
  }, [initialContent]);

  useImperativeHandle(ref, () => ({
    getContent: () => quillRef.current?.root.innerHTML || '',
    getContents: () => quillRef.current?.getContents() || { ops: [] },
    setContent: (content: string) => {
      if (quillRef.current) {
        quillRef.current.root.innerHTML = content;
      }
    },
  }));

  const handleEditorClick = (e: React.MouseEvent) => {
    if (quillRef.current) {
      const target = e.target as HTMLElement;
      const editor = editorRef.current;
      
      // Check if clicked element is read-only
      const sections = ['.question-text'];
      const isReadOnly = sections.some(selector => 
        target.matches(selector) || target.closest(selector)
      );
      
      if (isReadOnly) {
        e.preventDefault();
        return;
      }
      
      if (target === editor || target.classList.contains('ql-editor') || target.closest('.ql-editor')) {
        quillRef.current.focus();
        
        if (target === editor || (target.classList.contains('ql-editor') && target.textContent?.trim() === '')) {
          const length = quillRef.current.getLength();
          quillRef.current.setSelection(length - 1);
        }
      }
    }
  };

  return (
    <div
      ref={editorRef}
      className="border border-gray-300 rounded p-2 overflow-y-auto"
      style={{ minHeight: '500px' }}
      onClick={handleEditorClick}
    />
  );
});

ReadOnlyRichTextEditor.displayName = 'ReadOnlyRichTextEditor';

export default dynamic(() => Promise.resolve(ReadOnlyRichTextEditor), {
  ssr: false,
});
