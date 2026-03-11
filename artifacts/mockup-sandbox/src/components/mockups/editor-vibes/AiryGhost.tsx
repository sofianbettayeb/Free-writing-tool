import React from 'react';
import { 
  Plus, Search, Menu, Share, ChevronDown, 
  Bold, Italic, Underline, Strikethrough, Code,
  List, ListOrdered, Quote, SquareTerminal, Table, Minus,
  Link, Image as ImageIcon
} from 'lucide-react';

export function AiryGhost() {
  return (
    <div className="w-full h-screen flex overflow-hidden font-sans" style={{ backgroundColor: '#ffffff' }}>
      {/* Sidebar */}
      <div className="w-[260px] flex flex-col flex-shrink-0" style={{ backgroundColor: '#fafafa', borderRight: '1px solid #f0f0f0' }}>
        {/* Top */}
        <div className="px-5 py-6 flex items-center justify-between">
          <h1 className="font-light text-xl tracking-tight" style={{ color: '#111' }}>Free writing</h1>
          <button className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm transition-colors" style={{ color: '#7c3aed', borderColor: '#ede9fe' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5f3ff'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {/* Search */}
        <div className="px-5 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border" style={{ backgroundColor: '#fafafa', borderColor: '#f0f0f0' }}>
            <Search className="w-3.5 h-3.5" style={{ color: '#d1d5db' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent text-sm outline-none w-full placeholder:text-[#d1d5db]"
              style={{ color: '#374151' }}
            />
          </div>
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto px-3">
          {/* Entry 1 (Selected) */}
          <div className="group relative rounded-lg px-4 py-3 cursor-pointer transition-colors" style={{ backgroundColor: '#f5f3ff' }}>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: '#7c3aed' }}></div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-normal text-sm ml-2" style={{ color: '#4c1d95' }}>Morning Pages</span>
              <span className="text-xs" style={{ color: '#d1d5db' }}>Mar 11</span>
            </div>
            <div className="flex gap-2 mt-2 ml-2">
              <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}>journaling</span>
            </div>
          </div>

          {/* Entry 2 */}
          <div className="group relative rounded-lg px-4 py-3 cursor-pointer transition-colors mt-1" onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div className="flex justify-between items-baseline">
              <span className="font-normal text-sm" style={{ color: '#111' }}>Project Reflections</span>
              <span className="text-xs" style={{ color: '#d1d5db' }}>Mar 9</span>
            </div>
          </div>

          {/* Entry 3 */}
          <div className="group relative rounded-lg px-4 py-3 cursor-pointer transition-colors mt-1" onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div className="flex justify-between items-baseline">
              <span className="font-normal text-sm" style={{ color: '#111' }}>Book Notes: Thinking Fast</span>
              <span className="text-xs" style={{ color: '#d1d5db' }}>Mar 7</span>
            </div>
          </div>

          {/* Entry 4 */}
          <div className="group relative rounded-lg px-4 py-3 cursor-pointer transition-colors mt-1" onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div className="flex justify-between items-baseline">
              <span className="font-normal text-sm" style={{ color: '#111' }}>Travel Plans</span>
              <span className="text-xs" style={{ color: '#d1d5db' }}>Mar 5</span>
            </div>
          </div>

          {/* Entry 5 */}
          <div className="group relative rounded-lg px-4 py-3 cursor-pointer transition-colors mt-1" onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div className="flex justify-between items-baseline">
              <span className="font-normal text-sm" style={{ color: '#111' }}>Why I Write</span>
              <span className="text-xs" style={{ color: '#d1d5db' }}>Feb 28</span>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="px-5 py-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          <span className="text-xs" style={{ color: '#d1d5db' }}>All changes saved</span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: '#ffffff' }}>
        {/* Action bar */}
        <div className="h-12 px-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f3f3f3' }}>
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-md hover:bg-gray-50 text-[#c4c4c4]">
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-sm font-normal" style={{ color: '#111' }}>Morning Pages</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md hover:bg-gray-50" style={{ color: '#374151' }}>
            <Share className="w-3.5 h-3.5" />
            Export
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-1.5 flex items-center gap-6 overflow-x-auto flex-shrink-0 hide-scrollbar" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f3f3f3' }}>
          {/* Format dropdown */}
          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="text-xs text-[#374151] group-hover:text-[#6d28d9]">Normal text</span>
            <ChevronDown className="w-3 h-3 text-[#c4c4c4]" />
          </div>

          {/* Font dropdown */}
          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="text-xs text-[#374151] group-hover:text-[#6d28d9] font-serif">Georgia</span>
            <ChevronDown className="w-3 h-3 text-[#c4c4c4]" />
          </div>

          {/* Inline styles */}
          <div className="flex items-center gap-1">
            <button className="p-1 rounded text-[#7c3aed] bg-[#ede9fe]"><Bold className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><Italic className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><Underline className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><Strikethrough className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><Code className="w-3.5 h-3.5" /></button>
          </div>

          {/* Block styles */}
          <div className="flex items-center gap-1">
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><List className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><ListOrdered className="w-3.5 h-3.5" /></button>
          </div>

          {/* Inserts */}
          <div className="flex items-center gap-1">
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><Quote className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><SquareTerminal className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><Table className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><Minus className="w-3.5 h-3.5" /></button>
          </div>

          {/* Links/Media */}
          <div className="flex items-center gap-1">
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><Link className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded text-[#c4c4c4] hover:text-[#6d28d9] hover:bg-[#f5f3ff]"><ImageIcon className="w-3.5 h-3.5" /></button>
          </div>
          
          <div className="ml-auto text-[10px]" style={{ color: '#d1d5db' }}>
            312 words
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="max-w-[720px] mx-auto px-16 py-20">
            {/* Title */}
            <input 
              type="text" 
              value="Morning Pages"
              readOnly
              className="w-full bg-transparent outline-none font-light text-4xl tracking-tight mb-12 placeholder:text-[#d1d5db]"
              style={{ color: '#111' }}
            />

            {/* Content */}
            <div className="font-serif text-lg" style={{ color: '#374151', lineHeight: '1.9' }}>
              <p className="mb-8">
                Started the day with a quiet cup of coffee. The morning light is hitting the desk exactly the way I like it—soft, diffused, offering no resistance. It feels like a good day to clear my head and get some thoughts down before the noise of the inbox takes over.
              </p>
              <p className="mb-8">
                I've been thinking a lot lately about the balance between consumption and creation. It's so easy to slip into a reactive state, just absorbing information without synthesizing it. This dedicated time to write without constraints feels necessary, almost medicinal.
              </p>
              <p className="mb-8">
                The project we wrapped up last week still lingers in my mind. There were friction points that could have been avoided, but the final outcome was surprisingly solid. Sometimes the process is messy even when the result is clean.
              </p>
              
              <hr className="my-12 border-0 h-[1px]" style={{ backgroundColor: '#f3f4f6' }} />
            </div>
          </div>
          
          {/* Footer status */}
          <div className="absolute bottom-6 right-8 text-[10px]" style={{ color: '#d1d5db' }}>
            Saved · 312 words
          </div>
        </div>
      </div>
    </div>
  );
}
