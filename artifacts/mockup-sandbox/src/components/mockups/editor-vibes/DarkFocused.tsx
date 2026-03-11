import React from "react";
import { 
  Menu, Share, ChevronDown, Bold, Italic, Underline, Strikethrough, 
  Code, List, ListOrdered, Quote, SquareCode, Table, Minus, 
  Link, Image as ImageIcon, Search, Plus, Circle
} from "lucide-react";

export function DarkFocused() {
  return (
    <div className="w-full h-screen flex overflow-hidden font-sans selection:bg-[#1f6feb]/30 selection:text-[#e6edf3]" style={{ backgroundColor: '#161b22' }}>
      
      {/* LEFT SIDEBAR */}
      <div 
        className="w-[260px] flex-shrink-0 flex flex-col h-full border-r"
        style={{ backgroundColor: '#0d1117', borderColor: '#30363d' }}
      >
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="font-mono text-sm font-semibold tracking-wide" style={{ color: '#58a6ff' }}>
            free writing<span className="animate-pulse">|</span>
          </div>
          <button 
            className="rounded px-3 py-1 text-sm font-medium transition-colors hover:brightness-110"
            style={{ backgroundColor: '#1f6feb', color: 'white' }}
          >
            New entry
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div 
            className="flex items-center rounded-md px-2 py-1.5 border"
            style={{ backgroundColor: '#21262d', borderColor: '#30363d' }}
          >
            <Search className="w-4 h-4 mr-2" style={{ color: '#8b949e' }} />
            <input 
              type="text" 
              placeholder="Search entries..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder-[#8b949e]"
              style={{ color: '#c9d1d9' }}
            />
          </div>
        </div>

        {/* Entry List */}
        <div className="flex-1 overflow-y-auto">
          {/* Entry 1 (Active) */}
          <div 
            className="px-4 py-3 border-l-2 cursor-pointer group transition-colors"
            style={{ backgroundColor: '#1f2937', borderColor: '#60a5fa' }} // blue-400 border
          >
            <div className="font-medium mb-1 truncate" style={{ color: '#e6edf3' }}>Morning Pages</div>
            <div className="font-mono text-xs mb-2" style={{ color: '#8b949e' }}>Mar 11, 2026</div>
            <div className="text-sm line-clamp-2 leading-relaxed" style={{ color: '#8b949e' }}>
              Started the day with a quiet cup of coffee. The house was completely silent, which is exactly what I needed to clear my head before...
            </div>
            <div className="mt-2 flex gap-2">
              <span 
                className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: '#1f2937', color: '#58a6ff', borderColor: '#30363d' }}
              >
                morning
              </span>
            </div>
          </div>

          {/* Entry 2 */}
          <div 
            className="px-4 py-3 border-l-2 border-transparent cursor-pointer hover:bg-[#1a2232] transition-colors"
          >
            <div className="font-medium mb-1 truncate" style={{ color: '#e6edf3' }}>Project Reflections</div>
            <div className="font-mono text-xs mb-2" style={{ color: '#8b949e' }}>Mar 9, 2026</div>
            <div className="text-sm line-clamp-2 leading-relaxed" style={{ color: '#8b949e' }}>
              The team finished the sprint with unexpected results. I think we need to recalibrate our expectations for the next phase.
            </div>
          </div>

          {/* Entry 3 */}
          <div 
            className="px-4 py-3 border-l-2 border-transparent cursor-pointer hover:bg-[#1a2232] transition-colors"
          >
            <div className="font-medium mb-1 truncate" style={{ color: '#e6edf3' }}>Book Notes: Thinking Fast</div>
            <div className="font-mono text-xs mb-2" style={{ color: '#8b949e' }}>Mar 7, 2026</div>
            <div className="text-sm line-clamp-2 leading-relaxed" style={{ color: '#8b949e' }}>
              Kahneman's framework of System 1 and System 2 thinking explains so much about our reactive biases.
            </div>
          </div>

          {/* Entry 4 */}
          <div 
            className="px-4 py-3 border-l-2 border-transparent cursor-pointer hover:bg-[#1a2232] transition-colors"
          >
            <div className="font-medium mb-1 truncate" style={{ color: '#e6edf3' }}>Travel Plans</div>
            <div className="font-mono text-xs mb-2" style={{ color: '#8b949e' }}>Mar 5, 2026</div>
            <div className="text-sm line-clamp-2 leading-relaxed" style={{ color: '#8b949e' }}>
              Thinking about a weekend trip to the coast. The weather is supposed to clear up by Friday afternoon.
            </div>
          </div>

          {/* Entry 5 */}
          <div 
            className="px-4 py-3 border-l-2 border-transparent cursor-pointer hover:bg-[#1a2232] transition-colors"
          >
            <div className="font-medium mb-1 truncate" style={{ color: '#e6edf3' }}>Why I Write</div>
            <div className="font-mono text-xs mb-2" style={{ color: '#8b949e' }}>Feb 28, 2026</div>
            <div className="text-sm line-clamp-2 leading-relaxed" style={{ color: '#8b949e' }}>
              There's something about putting words on a page that solidifies fleeting thoughts into something tangible.
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div 
          className="p-3 border-t flex items-center justify-between font-mono text-xs"
          style={{ borderColor: '#30363d', color: '#8b949e' }}
        >
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-[#3fb950] text-[#3fb950]" />
            <span>Synced</span>
          </div>
          <div>5 entries</div>
        </div>
      </div>

      {/* RIGHT EDITOR */}
      <div className="flex-1 flex flex-col h-full relative z-0" style={{ backgroundColor: '#1c2128' }}>
        
        {/* Action Bar */}
        <div 
          className="h-12 border-b flex items-center justify-between px-4 flex-shrink-0"
          style={{ backgroundColor: '#0d1117', borderColor: '#30363d' }}
        >
          <div className="flex items-center gap-3">
            <button className="p-1 rounded hover:bg-[#21262d] transition-colors text-[#8b949e] hover:text-[#e6edf3]">
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium" style={{ color: '#8b949e' }}>Morning Pages</span>
          </div>
          <button className="flex items-center gap-2 text-sm px-2.5 py-1.5 rounded hover:bg-[#21262d] transition-colors text-[#8b949e] hover:text-[#e6edf3]">
            <Share className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Formatting Toolbar */}
        <div 
          className="flex items-center flex-wrap gap-1 px-4 py-1.5 border-b shadow-sm flex-shrink-0"
          style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}
        >
          <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#21262d] text-sm font-medium text-[#e6edf3] mr-2">
            Normal <ChevronDown className="w-3 h-3 text-[#8b949e]" />
          </button>

          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: '#30363d' }}></div>

          <button className="p-1.5 rounded bg-[#21262d] text-[#58a6ff]">
            <Bold className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <Italic className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <Underline className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <Strikethrough className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <Code className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: '#30363d' }}></div>

          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <List className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: '#30363d' }}></div>

          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <Quote className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <SquareCode className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <Table className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: '#30363d' }}></div>

          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <Link className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]">
            <ImageIcon className="w-4 h-4" />
          </button>

          <div className="flex-1"></div>

          <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#21262d] text-sm text-[#8b949e] hover:text-[#e6edf3]">
            Inter <ChevronDown className="w-3 h-3" />
          </button>

          <div className="text-xs font-mono ml-4" style={{ color: '#8b949e' }}>
            342 words
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center shadow-[inset_0_0_0_1px_#30363d]">
          <div className="w-full max-w-3xl px-8 py-12 flex flex-col gap-6">
            
            <input 
              type="text" 
              className="w-full bg-transparent border-none outline-none font-sans font-bold text-3xl placeholder-[#8b949e]"
              style={{ color: '#e6edf3' }}
              defaultValue="Morning Pages"
              placeholder="Untitled"
            />

            <div className="font-sans leading-relaxed text-[15px] space-y-5" style={{ color: '#c9d1d9' }}>
              <p>
                Started the day with a quiet cup of coffee. The house was completely silent, which is exactly what I needed to clear my head before jumping into the chaos of the week. There's a certain clarity that only comes before the sun fully rises, before the notifications start pouring in.
              </p>
              
              <p>
                I've been thinking a lot about the architecture of our current project. It feels like we're overcomplicating things that should be simple. If we strip away the abstraction layers, the core logic is quite elegant. I sketched out a rough idea yesterday:
              </p>

              <div 
                className="font-mono text-sm p-4 rounded-md border my-6"
                style={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#3fb950' }}
              >
                <code>
                  const processEvents = (events) ={'>'} {'{\n'}
                  {'  '}return events.filter(e ={'>'} e.valid)\n
                  {'               '}.map(transformPayload);\n
                  {'}'}
                </code>
              </div>

              <p>
                Maybe I'll pitch this refactor during the standup today. But for now, I need to focus on just getting words down. The hardest part is always the transition from thinking to doing. Once I'm in the flow, everything else fades away.
              </p>

              <p>
                Note to self: Pick up more dark roast beans on the way home. The current batch is almost out.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
