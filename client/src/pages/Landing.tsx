import {
  ArrowRight,
  Globe,
  ShieldCheck,
  Download,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Timer,
  Tags,
  WifiOff,
  Pencil,
} from "lucide-react";

function EditorPreview() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-stone-200"
      style={{ boxShadow: "0 24px 80px -12px rgba(0,0,0,0.12), 0 4px 20px -4px rgba(0,0,0,0.06)" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Pencil className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-sm font-light text-stone-600 tracking-tight">Free writing</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400">Morning Pages</span>
          <span className="text-xs text-stone-400 border border-stone-200 rounded-md px-2 py-0.5 flex items-center gap-1">
            <Download className="w-2.5 h-2.5" />
            Export
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-4 py-1.5 bg-white border-b border-stone-100">
        <span className="text-[11px] text-stone-400 pr-2 border-r border-stone-100 mr-1.5">Normal</span>
        <button className="p-1 rounded text-stone-400 hover:bg-stone-50"><Bold className="w-3 h-3" /></button>
        <button className="p-1 rounded text-stone-400"><Italic className="w-3 h-3" /></button>
        <button className="p-1 rounded text-stone-400"><Underline className="w-3 h-3" /></button>
        <span className="w-px h-3 bg-stone-100 mx-1.5" />
        <button className="p-1 rounded text-stone-400"><List className="w-3 h-3" /></button>
        <button className="p-1 rounded text-stone-400"><Link className="w-3 h-3" /></button>
        <span className="flex-1" />
        <span className="text-[11px] text-stone-400 italic mr-2">Georgia</span>
        <span className="text-[11px] text-stone-300">312 words</span>
      </div>

      {/* Writing area */}
      <div className="bg-white px-10 pt-9 pb-10" style={{ fontFamily: "Georgia, serif" }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-light text-stone-900 mb-6 tracking-tight" style={{ letterSpacing: "-0.01em" }}>
            Morning Pages
          </h2>
          <p className="text-[15px] text-stone-600 leading-[1.85] mb-5">
            Started the day with a quiet cup of coffee. The morning light is hitting the desk exactly the way I
            like it—soft, diffused, offering no resistance. It feels like a good day to clear my head and get
            some thoughts down before the noise of the inbox takes over.
          </p>
          <p className="text-[15px] text-stone-500 leading-[1.85]">
            I've been thinking a lot lately about the balance between consumption and creation. It's so easy to
            slip into a reactive state, just absorbing information without synthesizing it.
            <span className="inline-block w-0.5 h-4 bg-stone-900 ml-0.5 align-middle" />
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-t border-stone-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[11px] text-stone-400">Saved</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-stone-300">
          <Timer className="w-2.5 h-2.5" />
          <span>25:00</span>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Globe,
    title: "Nothing to install",
    body: "Runs entirely in your browser. Open a tab and your editor is ready. No apps, no updates, no friction.",
  },
  {
    icon: ShieldCheck,
    title: "Your words, your device",
    body: "Entries are stored locally by default. Works offline. Enable sync only if you want it.",
  },
  {
    icon: Download,
    title: "Export anywhere",
    body: "Download as Markdown, plain text, or HTML. Copy directly to ChatGPT or any AI tool.",
  },
];

const TRUST = [
  { icon: WifiOff, label: "Works offline" },
  { icon: ShieldCheck, label: "Your data stays private" },
  { icon: Tags, label: "Tag & organize entries" },
  { icon: Timer, label: "Focus timer built in" },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
          <span className="text-base font-light text-stone-900 tracking-tight">Free writing</span>
        </div>
        <button
          onClick={() => window.location.href = '/api/login'}
          className="text-sm text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1.5"
        >
          Start writing
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-8 pt-14 pb-16 text-center">

        {/* SEO eyebrow */}
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-stone-400 mb-5">
          Free online writing tool
        </p>

        <h1
          className="text-5xl lg:text-[4.5rem] text-stone-900 leading-[1.05] mb-7"
          style={{ fontWeight: 300, letterSpacing: "-0.025em" }}
        >
          Write freely.<br />
          <span className="text-stone-400">Without the clutter.</span>
        </h1>

        <p className="text-lg text-stone-500 leading-relaxed max-w-md mx-auto mb-10">
          A quiet, browser-based space for your thoughts.
          No apps, no accounts — just open and write.
        </p>

        <button
          onClick={() => window.location.href = '/api/login'}
          data-testid="button-start-writing"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium px-7 py-3.5 rounded-full transition-colors"
        >
          Start writing free
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-sm text-stone-400">
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {label}
            </span>
          ))}
        </div>
      </main>

      {/* Editor preview */}
      <div className="max-w-3xl mx-auto px-8 pb-28">
        <EditorPreview />
      </div>

      {/* Features */}
      <section className="border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-8 py-20 grid md:grid-cols-3 gap-10">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center mb-4">
                <Icon className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-stone-900 mb-2">{title}</p>
              <p className="text-sm text-stone-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-8 py-24 text-center">
          <p
            className="text-3xl font-light text-stone-900 mb-8 tracking-tight"
            style={{ letterSpacing: "-0.015em" }}
          >
            Open your browser. Start writing.
          </p>
          <button
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-start-writing-bottom"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium px-7 py-3.5 rounded-full transition-colors"
          >
            Open the free editor
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Pencil className="w-3.5 h-3.5 text-stone-300" strokeWidth={1.5} />
            <span className="text-sm text-stone-400 font-light">Free writing</span>
          </div>
          <span className="text-sm text-stone-400">Free online writing tool · No ads · No tracking</span>
        </div>
      </footer>
    </div>
  );
}
