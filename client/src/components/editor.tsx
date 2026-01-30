import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { DOMSerializer } from '@tiptap/pm/model';
import { useState, useEffect, useRef, useCallback } from 'react';
import { JournalEntry, InsertJournalEntry } from '@shared/schema';
import { uploadImage, getImageFromClipboard, getImagesFromDrop, isImageFile } from '@/lib/imageUpload';

interface EditorProps {
  entry: JournalEntry;
  onUpdate: (data: Partial<InsertJournalEntry>) => void;
  sidebarOpen?: boolean;
}

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', family: 'Inter, system-ui, sans-serif' },
  { value: 'serif', label: 'Charter', family: 'Charter, Georgia, serif' },
  { value: 'mono', label: 'JetBrains Mono', family: 'JetBrains Mono, Menlo, monospace' },
  { value: 'system', label: 'System UI', family: 'system-ui, sans-serif' },
  { value: 'times', label: 'Times New Roman', family: 'Times New Roman, serif' },
  { value: 'georgia', label: 'Georgia', family: 'Georgia, serif' },
];

export function Editor({ entry, onUpdate, sidebarOpen = true }: EditorProps) {
  const [selectedFont, setSelectedFont] = useState('inter');
  const [title, setTitle] = useState(entry.title || '');
  const [tags, setTags] = useState<string[]>(entry.tags || []);
  const [tagInput, setTagInput] = useState('');
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
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
        allowBase64: true,
      }),
    ],
    content: entry.content || '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const text = editor.getText();
      const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      // Debounce updates to database
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        onUpdate({
          content,
          wordCount: wordCount.toString(),
        });
      }, 1000); // Wait 1 second after typing stops
    },
    editorProps: {
      handleDOMEvents: {
        drop: (view, event) => {
          event.preventDefault();
          const files = getImagesFromDrop(event.dataTransfer!);
          
          if (files.length > 0) {
            const { schema } = view.state;
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            
            files.forEach(async (file) => {
              try {
                const imagePath = await uploadImage(file);
                const imageUrl = window.location.origin + imagePath;
                
                if (coordinates) {
                  const node = schema.nodes.image.create({ src: imageUrl });
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                }
              } catch (error) {
                // Handle upload error silently in production
              }
            });
          }
          
          return false;
        },
        dragover: (view, event) => {
          event.preventDefault();
          return false;
        },
        paste: (view, event) => {
          const clipboardData = event.clipboardData;
          if (!clipboardData) return false;
          
          const imageFile = getImageFromClipboard(clipboardData);
          if (imageFile) {
            event.preventDefault();
            
            uploadImage(imageFile).then((imagePath) => {
              const imageUrl = window.location.origin + imagePath;
              editor?.chain().focus().setImage({ src: imageUrl }).run();
            }).catch((error) => {
              // Handle upload error silently in production
            });
            
            return true;
          }
          
          return false;
        },
        copy: (view, event) => {
          const { state } = view;
          const { selection } = state;
          
          // Only handle if there's a selection
          if (selection.empty) return false;
          
          // Get the selected content
          const slice = selection.content();
          const fragment = slice.content;
          
          // Check if selection contains images
          let hasImages = false;
          const imageUrls: string[] = [];
          
          fragment.descendants((node) => {
            if (node.type.name === 'image') {
              hasImages = true;
              imageUrls.push(node.attrs.src);
            }
          });
          
          if (!hasImages) return false; // Let default behavior handle text-only
          
          event.preventDefault();
          
          try {
            // Get HTML content of selection
            const div = document.createElement('div');
            const dom = DOMSerializer.fromSchema(state.schema).serializeFragment(fragment);
            div.appendChild(dom);
            const htmlContent = div.innerHTML;
            
            // Get plain text content
            const textContent = div.textContent || '';
            
            // Handle async clipboard operations in background
            const copyWithImages = async () => {
              try {
                const clipboardItems = [];
                
                // Add HTML and text to clipboard
                clipboardItems.push(
                  new ClipboardItem({
                    'text/html': new Blob([htmlContent], { type: 'text/html' }),
                    'text/plain': new Blob([textContent], { type: 'text/plain' })
                  })
                );
                
                // For each image, try to fetch and add to clipboard
                for (const imageUrl of imageUrls) {
                  try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    clipboardItems.push(new ClipboardItem({
                      [blob.type]: blob
                    }));
                  } catch (error) {
                    // If we can't fetch the image, continue with others
                    console.warn('Could not fetch image for clipboard:', imageUrl);
                  }
                }
                
                // Write to clipboard
                await navigator.clipboard.write(clipboardItems);
              } catch (error) {
                console.warn('Failed to copy content with images:', error);
                // Fallback: put HTML in clipboard the traditional way
                event.clipboardData?.setData('text/html', htmlContent);
                event.clipboardData?.setData('text/plain', textContent);
              }
            };
            
            // Start async operation
            copyWithImages();
            
            // Also set the data synchronously as fallback
            if (event.clipboardData) {
              event.clipboardData.setData('text/html', htmlContent);
              event.clipboardData.setData('text/plain', textContent);
            }
            
            return true;
            
          } catch (error) {
            console.warn('Failed to handle copy event:', error);
            return false; // Fall back to default behavior
          }
        },
      },
    },
  });

  // Update editor content when entry changes (only when switching entries)
  useEffect(() => {
    if (editor && entry.content !== undefined) {
      const currentContent = editor.getHTML();
      if (currentContent !== entry.content) {
        editor.commands.setContent(entry.content || '');
      }
    }
  }, [editor, entry.id]); // Only update when entry ID changes

  // Sync title state with entry prop
  useEffect(() => {
    setTitle(entry.title || '');
    setTags(entry.tags || []);
  }, [entry.id, entry.title, entry.tags]); // Update when entry changes

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    
    // Debounce title updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      onUpdate({
        title: newTitle,
      });
    }, 1000);
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    
    // Debounce tag updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      onUpdate({ tags: newTags });
    }, 500);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      handleTagsChange(newTags);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    handleTagsChange(newTags);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor?.chain().focus().toggleCode().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const insertLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const insertImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && isImageFile(file)) {
        try {
          const imagePath = await uploadImage(file);
          const imageUrl = window.location.origin + imagePath;
          editor?.chain().focus().setImage({ src: imageUrl }).run();
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
    };
    input.click();
  }, [editor]);

  const changeFontFamily = (fontValue: string) => {
    setSelectedFont(fontValue);
    const font = FONT_OPTIONS.find(f => f.value === fontValue);
    if (font && editor) {
      const editorElement = editor.options.element as HTMLElement;
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
    <div className="flex flex-col min-h-0 h-full">
      {/* Formatting Toolbar */}
      <div className="border-b border-stone-200 px-4 py-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleBold}
              className={`p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 ${
                editor.isActive('bold') ? 'bg-stone-200' : ''
              }`}
              title="Bold (Ctrl+B)"
              aria-label="Bold"
              aria-pressed={editor.isActive('bold')}
              data-testid="button-bold"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
              </svg>
            </button>
            
            <button
              onClick={toggleItalic}
              className={`p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 ${
                editor.isActive('italic') ? 'bg-stone-200' : ''
              }`}
              title="Italic (Ctrl+I)"
              aria-label="Italic"
              aria-pressed={editor.isActive('italic')}
              data-testid="button-italic"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
              </svg>
            </button>

            <button
              onClick={toggleUnderline}
              className={`p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 ${
                editor.isActive('underline') ? 'bg-stone-200' : ''
              }`}
              title="Underline (Ctrl+U)"
              aria-label="Underline"
              aria-pressed={editor.isActive('underline')}
              data-testid="button-underline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
              </svg>
            </button>

            <button
              onClick={toggleStrike}
              className={`p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 ${
                editor.isActive('strike') ? 'bg-stone-200' : ''
              }`}
              title="Strikethrough (Ctrl+Shift+S)"
              aria-label="Strikethrough"
              aria-pressed={editor.isActive('strike')}
              data-testid="button-strike"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/>
              </svg>
            </button>

            <button
              onClick={toggleCode}
              className={`p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 ${
                editor.isActive('code') ? 'bg-stone-200' : ''
              }`}
              title="Code (Ctrl+E)"
              aria-label="Code"
              aria-pressed={editor.isActive('code')}
              data-testid="button-code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </button>

            <div className="w-px h-4 bg-stone-200 mx-1"></div>

            <button
              onClick={toggleBulletList}
              className={`p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 ${
                editor.isActive('bulletList') ? 'bg-stone-200' : ''
              }`}
              title="Bullet List"
              aria-label="Bullet list"
              aria-pressed={editor.isActive('bulletList')}
              data-testid="button-bullet-list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path>
              </svg>
            </button>

            <button
              onClick={toggleOrderedList}
              className={`p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 ${
                editor.isActive('orderedList') ? 'bg-stone-200' : ''
              }`}
              title="Numbered List"
              aria-label="Numbered list"
              aria-pressed={editor.isActive('orderedList')}
              data-testid="button-ordered-list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                <circle cx="2" cy="6" r="1" fill="currentColor"></circle>
                <circle cx="2" cy="10" r="1" fill="currentColor"></circle>
                <circle cx="2" cy="14" r="1" fill="currentColor"></circle>
                <circle cx="2" cy="18" r="1" fill="currentColor"></circle>
              </svg>
            </button>

            <button
              onClick={insertLink}
              className="p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1"
              title="Insert Link (Ctrl+K)"
              aria-label="Insert link"
              data-testid="button-link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </button>

            <button
              onClick={insertImage}
              className="p-2 hover:bg-stone-100 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1"
              title="Insert Image"
              aria-label="Insert image"
              data-testid="button-image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedFont}
              onChange={(e) => changeFontFamily(e.target.value)}
              className="text-sm border border-stone-200 rounded px-2 py-1.5 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
              data-testid="select-font"
              aria-label="Font family"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            <span className="text-sm text-stone-500">
              <span data-testid="text-word-count">{getWordCount()}</span> words
            </span>
          </div>
        </div>
      </div>

      {/* Editor Area - Fixed Layout */}
      <div className="flex-1 flex flex-col bg-white min-h-0">
        {/* Fixed Title Input */}
        <div className={`border-b border-stone-100 py-3 flex-shrink-0 ${sidebarOpen ? 'px-4 md:px-8' : 'px-6 md:px-12'}`}>
          <div className="max-w-3xl mx-auto">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled"
              className="w-full text-xl font-semibold border-none outline-none placeholder-stone-300 text-stone-900 leading-tight"
              data-testid="input-title"
              aria-label="Entry title"
            />
          </div>

          {/* Tags - simplified inline */}
          <div className="mt-2">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                  data-testid={`tag-${tag}`}
                >
                  <span className="mr-1">{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-stone-400 hover:text-stone-600 font-medium leading-none focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 rounded"
                    data-testid={`button-remove-tag-${tag}`}
                    aria-label={`Remove tag: ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder={tags.length === 0 ? "Add tags..." : "+"}
                className="min-w-[60px] flex-1 text-xs border-none outline-none placeholder-stone-400 text-stone-600 bg-transparent"
                data-testid="input-tag"
                aria-label="Add tag"
              />
            </div>
          </div>
        </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 min-h-0 overflow-y-auto py-6 ${sidebarOpen ? 'px-4 md:px-8' : 'px-6 md:px-12'}`}>
          <div className="max-w-3xl mx-auto">
            <EditorContent
              editor={editor}
              className="w-full prose prose-stone max-w-none focus-within:outline-none"
              style={{
                fontFamily: FONT_OPTIONS.find(f => f.value === selectedFont)?.family || 'Charter, Georgia, serif',
                fontSize: '17px',
                lineHeight: '1.8',
                color: '#292524'
              }}
              data-testid="editor-content"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
