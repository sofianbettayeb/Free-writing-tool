import {
  Plus, Search, Menu, Share, ChevronDown,
  Bold, Italic, Underline, Strikethrough, Code,
  List, ListOrdered, Quote, SquareTerminal, Table, Minus,
  Link, Image as ImageIcon
} from 'lucide-react';

const ENTRIES = [
  { title: 'Morning Pages', date: 'Mar 11', tag: 'journaling', selected: true },
  { title: 'Project Reflections', date: 'Mar 9', selected: false },
  { title: 'Book Notes: Thinking Fast', date: 'Mar 7', selected: false },
  { title: 'Travel Plans', date: 'Mar 5', selected: false },
  { title: 'Why I Write', date: 'Feb 28', selected: false },
];

function Divider() {
  return <div style={{ width: 1, height: 14, backgroundColor: '#eeecf9', flexShrink: 0 }} />;
}

export function AiryGhostCrisp() {
  return (
    <div className="w-full h-screen flex overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#ffffff' }}>

      {/* Sidebar */}
      <div className="flex flex-col flex-shrink-0" style={{ width: 252, backgroundColor: '#fafafa', borderRight: '1px solid #f2f2f2' }}>

        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '20px 18px 16px' }}>
          <span style={{ fontWeight: 300, fontSize: 17, color: '#111', letterSpacing: '-0.01em' }}>
            Free writing
          </span>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, color: '#7c3aed',
            border: '1px solid #e8e3fc', borderRadius: 999,
            padding: '4px 10px', backgroundColor: 'transparent', cursor: 'pointer'
          }}>
            <Plus size={12} />
            New
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '0 14px 14px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 10px', borderRadius: 7,
            border: '1px solid #eeecf9', backgroundColor: '#f9f8ff'
          }}>
            <Search size={12} color="#ccc" />
            <span style={{ fontSize: 12, color: '#ccc' }}>Search…</span>
          </div>
        </div>

        {/* Section label */}
        <div style={{ padding: '0 18px 8px' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d8d3f0' }}>
            Notes
          </span>
        </div>

        {/* Entry list */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '0 10px' }}>
          {ENTRIES.map((e, i) => (
            <div key={i} style={{
              position: 'relative',
              padding: '10px 10px 10px 14px',
              borderRadius: 7,
              cursor: 'pointer',
              marginBottom: 1,
              backgroundColor: e.selected ? '#f5f3ff' : 'transparent',
              borderLeft: e.selected ? '2px solid #a78bfa' : '2px solid transparent',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: e.selected ? 500 : 400,
                  color: e.selected ? '#4c1d95' : '#1f2937',
                  lineHeight: 1.3,
                  flex: 1,
                }}>
                  {e.title}
                </span>
              </div>
              <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#d1d5db' }}>{e.date}</span>
                {e.tag && (
                  <span style={{
                    fontSize: 10, color: '#8b5cf6',
                    backgroundColor: '#ede9fe', borderRadius: 999,
                    padding: '1px 7px'
                  }}>
                    {e.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid #f2f2f2' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#86efac' }} />
          <span style={{ fontSize: 11, color: '#d1d5db' }}>All changes saved</span>
        </div>
      </div>

      {/* Editor panel */}
      <div className="flex flex-col flex-1 min-w-0" style={{ backgroundColor: '#ffffff' }}>

        {/* Action bar */}
        <div style={{
          height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', borderBottom: '1px solid #f4f4f4', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ padding: 6, borderRadius: 6, color: '#d1d5db', cursor: 'pointer', background: 'none', border: 'none' }}>
              <Menu size={15} />
            </button>
            <span style={{ fontSize: 13, color: '#374151', fontWeight: 400 }}>Morning Pages</span>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 8px', borderRadius: 5
          }}>
            <Share size={12} />
            Export
          </button>
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '0 14px', height: 38,
          borderBottom: '1px solid #f4f4f4', flexShrink: 0, overflowX: 'auto'
        }}>
          {/* Style select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', paddingRight: 4 }}>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>Normal</span>
            <ChevronDown size={10} color="#d1d5db" />
          </div>

          <Divider />

          {/* Inline */}
          {[Bold, Italic, Underline, Strikethrough, Code].map((Icon, i) => (
            <button key={i} style={{
              padding: 4, borderRadius: 4, border: 'none', cursor: 'pointer',
              backgroundColor: i === 0 ? '#ede9fe' : 'transparent',
              color: i === 0 ? '#7c3aed' : '#c4c4c4',
            }}>
              <Icon size={13} />
            </button>
          ))}

          <Divider />

          {/* Lists */}
          {[List, ListOrdered].map((Icon, i) => (
            <button key={i} style={{ padding: 4, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#c4c4c4' }}>
              <Icon size={13} />
            </button>
          ))}

          <Divider />

          {/* Blocks */}
          {[Quote, SquareTerminal, Table, Minus].map((Icon, i) => (
            <button key={i} style={{ padding: 4, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#c4c4c4' }}>
              <Icon size={13} />
            </button>
          ))}

          <Divider />

          {/* Insert */}
          {[Link, ImageIcon].map((Icon, i) => (
            <button key={i} style={{ padding: 4, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: '#c4c4c4' }}>
              <Icon size={13} />
            </button>
          ))}

          <div style={{ flex: 1 }} />

          {/* Font select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
            <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'Georgia, serif' }}>Georgia</span>
            <ChevronDown size={10} color="#d1d5db" />
          </div>

          <div style={{ marginLeft: 8, fontSize: 11, color: '#e5e7eb' }}>312 words</div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div style={{ maxWidth: 640, margin: '0 auto', padding: '52px 40px 80px' }}>

            <input
              type="text"
              defaultValue="Morning Pages"
              readOnly
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em',
                color: '#111', marginBottom: 6, display: 'block'
              }}
            />
            <div style={{ height: 1, backgroundColor: '#f3f4f6', marginBottom: 36 }} />

            <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#374151', lineHeight: 1.85 }}>
              <p style={{ marginBottom: 28 }}>
                Started the day with a quiet cup of coffee. The morning light is hitting the desk exactly the way I like it—soft, diffused, offering no resistance. It feels like a good day to clear my head and get some thoughts down before the noise of the inbox takes over.
              </p>
              <p style={{ marginBottom: 28 }}>
                I've been thinking a lot lately about the balance between consumption and creation. It's so easy to slip into a reactive state, just absorbing information without synthesizing it. This dedicated time to write without constraints feels necessary, almost medicinal.
              </p>
              <p style={{ marginBottom: 28 }}>
                The project we wrapped up last week still lingers in my mind. There were friction points that could have been avoided, but the final outcome was surprisingly solid. Sometimes the process is messy even when the result is clean.
              </p>

              <div style={{ height: 1, backgroundColor: '#f3f4f6', margin: '40px 0' }} />
            </div>
          </div>
        </div>

        {/* Status footer */}
        <div style={{
          height: 32, borderTop: '1px solid #f4f4f4', display: 'flex', alignItems: 'center',
          justifyContent: 'flex-end', padding: '0 20px', flexShrink: 0
        }}>
          <span style={{ fontSize: 11, color: '#e5e7eb' }}>Saved · 312 words</span>
        </div>
      </div>
    </div>
  );
}
