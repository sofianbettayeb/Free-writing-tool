import {
  Plus, Search, Menu, Share, ChevronDown,
  Bold, Italic, Underline, Strikethrough, Code,
  List, ListOrdered, Quote, SquareTerminal, Table, Minus,
  Link, Image as ImageIcon
} from 'lucide-react';

function ToolDivider() {
  return <div style={{ width: 1, height: 14, backgroundColor: '#eeecf9', flexShrink: 0, margin: '0 3px' }} />;
}

export function AiryGhostEditorial() {
  return (
    <div className="w-full h-screen flex overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#ffffff' }}>

      {/* Sidebar */}
      <div className="flex flex-col flex-shrink-0" style={{ width: 256, backgroundColor: '#ffffff', borderRight: '1px solid #f0eef8' }}>

        {/* Header */}
        <div style={{ padding: '22px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 300, fontSize: 16, color: '#1a1a1a', letterSpacing: '-0.015em' }}>
            Free writing
          </span>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: '#8b5cf6',
            border: '1px solid #e8e3fc', borderRadius: 999,
            padding: '3px 9px', backgroundColor: 'transparent', cursor: 'pointer'
          }}>
            <Plus size={11} />
            New
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '0 14px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 10px', borderRadius: 6,
            border: '1px solid #f0eef8'
          }}>
            <Search size={11} color="#d8d3f0" />
            <span style={{ fontSize: 11, color: '#d8d3f0' }}>Search…</span>
          </div>
        </div>

        {/* Entries — grouped */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '0 12px' }}>

          {/* Group: Today */}
          <div style={{ padding: '4px 8px 6px', fontSize: 9, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#d8d3f0' }}>
            Today
          </div>

          {/* Selected entry */}
          <div style={{
            padding: '10px 10px 10px 12px', borderRadius: 8,
            backgroundColor: '#f5f3ff', borderLeft: '2px solid #a78bfa',
            marginBottom: 2, cursor: 'pointer'
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#3b1fa8', marginBottom: 3 }}>Morning Pages</div>
            <div style={{ fontSize: 11, color: '#c4b5fd', marginBottom: 5 }}>Mar 11</div>
            <div style={{ fontSize: 11, color: '#7c6fbb', lineHeight: 1.4 }}>
              Started the day with a quiet cup of coffee…
            </div>
            <div style={{ marginTop: 6 }}>
              <span style={{ fontSize: 10, color: '#8b5cf6', backgroundColor: '#ede9fe', borderRadius: 999, padding: '2px 8px' }}>
                journaling
              </span>
            </div>
          </div>

          {/* Group: This week */}
          <div style={{ padding: '12px 8px 6px', fontSize: 9, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#d8d3f0' }}>
            This week
          </div>

          {[
            { title: 'Project Reflections', date: 'Mar 9', snippet: 'The team finished the sprint with…' },
            { title: 'Book Notes: Thinking Fast', date: 'Mar 7' },
            { title: 'Travel Plans', date: 'Mar 5' },
          ].map((e, i) => (
            <div key={i} style={{ padding: '9px 10px 9px 14px', cursor: 'pointer', borderLeft: '2px solid transparent', marginBottom: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 400, color: '#374151' }}>{e.title}</span>
                <span style={{ fontSize: 11, color: '#e5e7eb', flexShrink: 0 }}>{e.date}</span>
              </div>
              {e.snippet && (
                <div style={{ marginTop: 2, fontSize: 11, color: '#d1d5db', lineHeight: 1.4 }}>{e.snippet}</div>
              )}
            </div>
          ))}

          {/* Earlier */}
          <div style={{ padding: '12px 8px 6px', fontSize: 9, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#d8d3f0' }}>
            Earlier
          </div>
          <div style={{ padding: '9px 10px 9px 14px', cursor: 'pointer', borderLeft: '2px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 400, color: '#374151' }}>Why I Write</span>
              <span style={{ fontSize: 11, color: '#e5e7eb' }}>Feb 28</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px 14px', borderTop: '1px solid #f0eef8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#86efac' }} />
            <span style={{ fontSize: 11, color: '#e5e7eb' }}>Saved</span>
          </div>
          <span style={{ fontSize: 11, color: '#e5e7eb' }}>5 entries</span>
        </div>
      </div>

      {/* Editor panel */}
      <div className="flex flex-col flex-1 min-w-0" style={{ backgroundColor: '#fffdf9' }}>

        {/* Action bar */}
        <div style={{
          height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px', borderBottom: '1px solid #f5f2ea', flexShrink: 0,
          backgroundColor: '#fffdf9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ padding: 5, borderRadius: 5, color: '#d1d5db', cursor: 'pointer', background: 'none', border: 'none' }}>
              <Menu size={15} />
            </button>
            <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 400 }}>Morning Pages</span>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, color: '#c4b5fd', background: 'none', border: 'none', cursor: 'pointer',
            padding: '3px 8px', borderRadius: 5
          }}>
            <Share size={12} />
            Export
          </button>
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '0 16px', height: 36,
          borderBottom: '1px solid #f5f2ea', flexShrink: 0, gap: 2,
          backgroundColor: '#fffdf9', overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, paddingRight: 4, cursor: 'pointer' }}>
            <span style={{ fontSize: 11, color: '#c4b5fd' }}>Normal</span>
            <ChevronDown size={10} color="#e5e7eb" />
          </div>

          <ToolDivider />

          {[Bold, Italic, Underline, Strikethrough, Code].map((Icon, i) => (
            <button key={i} style={{
              padding: 4, borderRadius: 4, border: 'none', cursor: 'pointer',
              backgroundColor: i === 0 ? '#f0ebff' : 'transparent',
              color: i === 0 ? '#8b5cf6' : '#ddd6fe',
            }}>
              <Icon size={12} />
            </button>
          ))}

          <ToolDivider />

          {[List, ListOrdered].map((Icon, i) => (
            <button key={i} style={{ padding: 4, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#ddd6fe' }}>
              <Icon size={12} />
            </button>
          ))}

          <ToolDivider />

          {[Quote, SquareTerminal, Table, Minus, Link, ImageIcon].map((Icon, i) => (
            <button key={i} style={{ padding: 4, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#ddd6fe' }}>
              <Icon size={12} />
            </button>
          ))}

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
            <span style={{ fontSize: 11, color: '#c4b5fd', fontFamily: 'Georgia, serif' }}>Georgia</span>
            <ChevronDown size={10} color="#e5e7eb" />
          </div>

          <div style={{ marginLeft: 10, fontSize: 11, color: '#e9d5ff' }}>312 words</div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 48px 80px' }}>

            {/* Big editorial title */}
            <input
              type="text"
              defaultValue="Morning Pages"
              readOnly
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em',
                color: '#111', display: 'block', marginBottom: 10, lineHeight: 1.1
              }}
            />

            {/* Byline */}
            <div style={{ fontSize: 12, color: '#d1d5db', letterSpacing: '0.04em', marginBottom: 40 }}>
              Tuesday, March 11, 2026
            </div>

            <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#4b5563', lineHeight: 1.9 }}>
              <p style={{ marginBottom: 28 }}>
                Started the day with a quiet cup of coffee. The morning light is hitting the desk exactly the way I like it—soft, diffused, offering no resistance. It feels like a good day to clear my head and get some thoughts down before the noise of the inbox takes over.
              </p>

              {/* Pull quote */}
              <blockquote style={{
                margin: '36px 0', padding: '0 0 0 24px',
                borderLeft: '2px solid #ddd6fe',
                fontStyle: 'italic', fontSize: 20,
                color: '#8b5cf6', lineHeight: 1.6, fontWeight: 300
              }}>
                The balance between consumption and creation is the real discipline.
              </blockquote>

              <p style={{ marginBottom: 28 }}>
                I've been thinking a lot lately about the balance between consumption and creation. It's so easy to slip into a reactive state, just absorbing information without synthesizing it. This dedicated time to write without constraints feels necessary, almost medicinal.
              </p>

              <p style={{ marginBottom: 28 }}>
                The project we wrapped up last week still lingers in my mind. There were friction points that could have been avoided, but the final outcome was surprisingly solid. Sometimes the process is messy even when the result is clean.
              </p>

              <div style={{ height: 1, backgroundColor: '#f5f0ff', margin: '44px 0' }} />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          height: 30, borderTop: '1px solid #f5f2ea',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 20px', flexShrink: 0, backgroundColor: '#fffdf9'
        }}>
          <span style={{ fontSize: 11, color: '#e9d5ff' }}>Saved · 312 words</span>
        </div>
      </div>
    </div>
  );
}
