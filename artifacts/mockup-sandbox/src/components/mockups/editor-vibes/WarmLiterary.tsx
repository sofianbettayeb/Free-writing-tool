import React from 'react';
import { 
  PenTool, 
  Plus, 
  Search, 
  Menu, 
  Share, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code,
  List, 
  ListOrdered, 
  Quote, 
  TerminalSquare, 
  Table2, 
  Minus, 
  Link, 
  Image as ImageIcon
} from 'lucide-react';

export function WarmLiterary() {
  return (
    <div className="w-full h-screen flex overflow-hidden font-sans text-[#5c4033] bg-[#fffcf7]">
      {/* LEFT SIDEBAR */}
      <div 
        className="w-[280px] flex-shrink-0 flex flex-col h-full border-r"
        style={{ backgroundColor: '#f5ece0', borderColor: '#e8d9c4' }}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool size={16} style={{ color: '#b5651d' }} />
            <span className="font-serif font-semibold text-[#3d2b1f] tracking-wide text-lg">
              Free writing
            </span>
          </div>
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
            style={{ backgroundColor: '#b5651d', color: 'white' }}
            title="New entry"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors"
            style={{ backgroundColor: '#ece0d0', borderColor: '#d6c4a8' }}
          >
            <Search size={14} style={{ color: '#9a7f6a' }} />
            <input 
              type="text" 
              placeholder="Search journals..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#9a7f6a]"
              style={{ color: '#5c4033' }}
            />
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col">
            
            {/* Selected Entry */}
            <div 
              className="px-4 py-3 cursor-pointer border-b transition-colors"
              style={{ backgroundColor: '#eeddc7', borderColor: '#e8d9c4' }}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-serif font-medium text-amber-900 truncate pr-2">Morning Pages</h3>
                <span className="text-[10px] whitespace-nowrap pt-1 font-sans" style={{ color: '#9a7f6a' }}>Mar 11, 2026</span>
              </div>
              <p className="text-xs line-clamp-2 leading-relaxed mb-2 font-sans" style={{ color: '#9a7f6a' }}>
                Started the day with a quiet cup of coffee. The morning light is filtering through the blinds in that specific way it only does in early spring...
              </p>
              <div className="flex gap-1.5 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-sans" style={{ backgroundColor: '#eeddc7', color: '#7a5230', border: '1px solid #d6c4a8' }}>
                  personal
                </span>
              </div>
            </div>

            {/* Entry 2 */}
            <div 
              className="px-4 py-3 cursor-pointer border-b transition-colors hover:bg-[#f0e4d0]"
              style={{ borderColor: '#e8d9c4' }}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-serif font-medium truncate pr-2" style={{ color: '#3d2b1f' }}>Project Reflections</h3>
                <span className="text-[10px] whitespace-nowrap pt-1 font-sans" style={{ color: '#9a7f6a' }}>Mar 9, 2026</span>
              </div>
              <p className="text-xs line-clamp-2 leading-relaxed font-sans" style={{ color: '#9a7f6a' }}>
                The team finished the sprint with unexpected results. I think we need to rethink our approach to the async communication problem we've been facing.
              </p>
            </div>

            {/* Entry 3 */}
            <div 
              className="px-4 py-3 cursor-pointer border-b transition-colors hover:bg-[#f0e4d0]"
              style={{ borderColor: '#e8d9c4' }}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-serif font-medium truncate pr-2" style={{ color: '#3d2b1f' }}>Book Notes: Thinking Fast</h3>
                <span className="text-[10px] whitespace-nowrap pt-1 font-sans" style={{ color: '#9a7f6a' }}>Mar 7, 2026</span>
              </div>
              <p className="text-xs line-clamp-2 leading-relaxed font-sans" style={{ color: '#9a7f6a' }}>
                Kahneman's framework of System 1 and System 2 thinking explains so many of my recent intuitive leaps—and blunders.
              </p>
            </div>

            {/* Entry 4 */}
            <div 
              className="px-4 py-3 cursor-pointer border-b transition-colors hover:bg-[#f0e4d0]"
              style={{ borderColor: '#e8d9c4' }}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-serif font-medium truncate pr-2" style={{ color: '#3d2b1f' }}>Travel Plans</h3>
                <span className="text-[10px] whitespace-nowrap pt-1 font-sans" style={{ color: '#9a7f6a' }}>Mar 5, 2026</span>
              </div>
              <p className="text-xs line-clamp-2 leading-relaxed font-sans" style={{ color: '#9a7f6a' }}>
                Thinking about a weekend trip to the coast. The weather is supposed to break soon, and I need to see the ocean.
              </p>
            </div>

            {/* Entry 5 */}
            <div 
              className="px-4 py-3 cursor-pointer border-b transition-colors hover:bg-[#f0e4d0]"
              style={{ borderColor: '#e8d9c4' }}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-serif font-medium truncate pr-2" style={{ color: '#3d2b1f' }}>Why I Write</h3>
                <span className="text-[10px] whitespace-nowrap pt-1 font-sans" style={{ color: '#9a7f6a' }}>Feb 28, 2026</span>
              </div>
              <p className="text-xs line-clamp-2 leading-relaxed font-sans" style={{ color: '#9a7f6a' }}>
                There's something about putting words on a page that solidifies thought. It turns the ephemeral hum of anxiety into something concrete.
              </p>
            </div>

          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t text-xs flex items-center justify-between font-sans" style={{ borderColor: '#e8d9c4', color: '#9a7f6a' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#b5651d' }}></span>
            <span>All changes saved</span>
          </div>
          <span>142 entries</span>
        </div>
      </div>

      {/* RIGHT EDITOR */}
      <div className="flex-1 flex flex-col h-full relative" style={{ backgroundColor: '#fffcf7' }}>
        
        {/* Top Action Bar */}
        <div 
          className="h-12 flex items-center justify-between px-4 border-b shrink-0"
          style={{ backgroundColor: '#f5ece0', borderColor: '#e8d9c4' }}
        >
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-md hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}>
              <Menu size={16} />
            </button>
            <span className="text-sm font-medium font-serif" style={{ color: '#9a7f6a' }}>Morning Pages</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}>
            <Share size={14} />
            <span>Export</span>
          </button>
        </div>

        {/* Formatting Toolbar */}
        <div 
          className="flex items-center gap-1 px-3 py-1.5 border-b shrink-0 flex-wrap overflow-x-auto"
          style={{ backgroundColor: '#fdf6e9', borderColor: '#e8d9c4', borderTopWidth: '1px', borderTopColor: '#e8d9c4' }}
        >
          <select 
            className="text-xs px-2 py-1 outline-none font-serif cursor-pointer transition-colors mr-2"
            style={{ backgroundColor: '#f5ece0', border: '1px solid #e8d9c4', color: '#5c4033', borderRadius: '4px' }}
            defaultValue="normal"
          >
            <option value="normal">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: '#e8d9c4' }}></div>

          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><Bold size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><Italic size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><Underline size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><Strikethrough size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><Code size={14} /></button>

          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: '#e8d9c4' }}></div>

          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><List size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><ListOrdered size={14} /></button>
          
          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: '#e8d9c4' }}></div>

          <button className="p-1.5 rounded transition-colors" style={{ backgroundColor: '#d6c4a8', color: '#3d2b1f' }}><Quote size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><TerminalSquare size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><Table2 size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><Minus size={14} /></button>

          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: '#e8d9c4' }}></div>

          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><Link size={14} /></button>
          <button className="p-1.5 rounded hover:bg-[#ecdcca] transition-colors" style={{ color: '#5c4033' }}><ImageIcon size={14} /></button>

          <div className="flex-1"></div>

          <select 
            className="text-xs px-2 py-1 outline-none font-sans cursor-pointer transition-colors mr-2"
            style={{ backgroundColor: '#f5ece0', border: '1px solid #e8d9c4', color: '#5c4033', borderRadius: '4px' }}
            defaultValue="serif"
          >
            <option value="serif">Lora</option>
            <option value="sans">Inter</option>
            <option value="mono">JetBrains</option>
          </select>

          <span className="text-[10px] uppercase tracking-wider font-semibold mr-2" style={{ color: '#9a7f6a' }}>
            342 Words
          </span>
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto px-12 py-16 flex justify-center">
          <div className="w-full max-w-2xl">
            <input 
              type="text" 
              value="Morning Pages"
              onChange={() => {}}
              className="w-full text-4xl font-bold font-serif bg-transparent border-none outline-none mb-8"
              style={{ color: '#3d2b1f' }}
              placeholder="Untitled"
            />
            
            <div className="prose prose-stone max-w-none font-serif text-lg leading-loose" style={{ color: '#5c4033' }}>
              <p className="mb-6">
                Started the day with a quiet cup of coffee. The morning light is filtering through the blinds in that specific way it only does in early spring. The air in the apartment feels still, almost expectant. I wanted to capture this moment before the noise of the day rushes in and scatters my thoughts.
              </p>
              
              <blockquote className="pl-4 my-8 italic" style={{ borderLeft: '4px solid #b5651d', color: '#5c4033' }}>
                "We write to taste life twice, in the moment and in retrospect." <br/>
                <span className="text-sm not-italic mt-2 block" style={{ color: '#9a7f6a' }}>— Anaïs Nin</span>
              </blockquote>

              <p className="mb-6">
                Thinking about the projects ahead this week. There's a lot to untangle, but sitting here, just letting the pen move across the page (or fingers across the keys), brings a sense of clarity. It's funny how the physical act of writing seems to organize the chaotic filing cabinet of my mind.
              </p>

              <p className="mb-6">
                I should try to keep this habit up. Just twenty minutes every morning. No editing, no crossing out. Just the raw, unpolished stream of whatever comes to the surface. It feels like sweeping the porch before opening the front door to guests.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
