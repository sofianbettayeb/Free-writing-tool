import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useState, useCallback, useEffect } from 'react';
import { JournalEntry } from '@shared/schema';

interface EditorProps {
  entry: Partial<JournalEntry>;
  onUpdate: (entry: Partial<JournalEntry>) => void;
}

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', family: 'Inter, system-ui, sans-serif' },
  { value: 'serif', label: 'Charter', family: 'Charter, Georgia, serif' },
  { value: 'mono', label: 'JetBrains Mono', family: 'JetBrains Mono, Menlo, monospace' },
  { value: 'system', label: 'System UI', family: 'system-ui, sans-serif' },
  { value: 'times', label: 'Times New Roman', family: 'Times New Roman, serif' },
  { value: 'georgia', label: 'Georgia', family: 'Georgia, serif' },
];

export function Editor({ entry, onUpdate }: EditorProps) {
  const [selectedFont, setSelectedFont] = useState('inter');
  const [title, setTitle] = useState(entry.title || '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
    ],
    content: entry.content || '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const text = editor.getText();
      const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      onUpdate({
        ...entry,
        content,
        wordCount: wordCount.toString(),
      });
    },
  });

  useEffect(() => {
    if (editor && entry.content !== editor.getHTML()) {
      editor.commands.setContent(entry.content || '');
    }
  }, [entry.content, editor]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate({
      ...entry,
      title: newTitle,
    });
  };

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const insertLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const insertImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const changeFontFamily = (fontValue: string) => {
    setSelectedFont(fontValue);
    const font = FONT_OPTIONS.find(f => f.value === fontValue);
    if (font && editor) {
      const editorElement = editor.options.element;
      if (editorElement) {
        editorElement.style.fontFamily = font.family;
      }
    }
  };

  const getWordCount = () => {
    return editor?.storage.characterCount?.words() || parseInt(entry.wordCount || '0');
  };

  if (!editor) {
    return <div className="flex-1 flex items-center justify-center">Loading editor...</div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Formatting Toolbar */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleBold}
              className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                editor.isActive('bold') ? 'bg-gray-200' : ''
              }`}
              title="Bold (Ctrl+B)"
              data-testid="button-bold"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
              </svg>
            </button>
            
            <button
              onClick={toggleItalic}
              className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                editor.isActive('italic') ? 'bg-gray-200' : ''
              }`}
              title="Italic (Ctrl+I)"
              data-testid="button-italic"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
              </svg>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            <button
              onClick={toggleBulletList}
              className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                editor.isActive('bulletList') ? 'bg-gray-200' : ''
              }`}
              title="Bullet List"
              data-testid="button-bullet-list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>

            <button
              onClick={insertLink}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Insert Link (Ctrl+K)"
              data-testid="button-link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </button>

            <button
              onClick={insertImage}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Insert Image"
              data-testid="button-image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedFont}
              onChange={(e) => changeFontFamily(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="select-font"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              <span data-testid="text-word-count">{getWordCount()}</span> words
            </div>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Entry title..."
            className="w-full text-2xl font-bold border-none outline-none mb-6 placeholder-gray-400"
            data-testid="input-title"
          />
          
          <EditorContent
            editor={editor}
            className={`prose prose-lg max-w-none focus:outline-none min-h-[400px] ${
              FONT_OPTIONS.find(f => f.value === selectedFont)?.family || 'Inter, system-ui, sans-serif'
            }`}
            style={{
              fontFamily: FONT_OPTIONS.find(f => f.value === selectedFont)?.family || 'Inter, system-ui, sans-serif'
            }}
            data-testid="editor-content"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Auto-save enabled</span>
            <span data-testid="text-character-count">{editor.storage.characterCount?.characters() || 0} characters</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Ctrl+S to save</span>
            <span>•</span>
            <span>Ctrl+E to export</span>
          </div>
        </div>
      </div>
    </div>
  );
}
