import { useRef, useCallback } from 'react';
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Link, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function RichTextEditor({ value = '', onChange, label, error, height = 300 }) {
  const editorRef = useRef(null);

  const exec = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange?.({ target: { value: editorRef.current.innerHTML } });
    }
    editorRef.current?.focus();
  }, [onChange]);

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange?.({ target: { value: editorRef.current.innerHTML } });
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { type: 'divider' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
    { type: 'divider' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Ordered List' },
    { type: 'divider' },
    { icon: Link, action: handleInsertLink, title: 'Insert Link' },
    { type: 'divider' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  ];

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-brand-ink">
          {label}
        </label>
      )}
      <div className={`border rounded-lg overflow-hidden ${error ? 'border-red-400' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-brand-green/20 focus-within:border-brand-green`}>
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
          {toolbarButtons.map((btn, i) =>
            btn.type === 'divider' ? (
              <div key={i} className="w-px h-5 bg-gray-300 mx-1" />
            ) : (
              <button
                key={i}
                type="button"
                title={btn.title}
                onClick={() => btn.action ? btn.action() : exec(btn.command, btn.value)}
                className="p-1.5 rounded hover:bg-gray-200 text-brand-gray hover:text-brand-ink transition-colors"
              >
                <btn.icon className="w-4 h-4" />
              </button>
            )
          )}
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: value }}
          className="px-4 py-3 text-sm text-brand-ink focus:outline-none overflow-y-auto"
          style={{ minHeight: height }}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
