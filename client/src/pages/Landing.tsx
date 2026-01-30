import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import appIllustration from "@assets/generated_images/Writing_app_interface_illustration_9ca83be2.png";

export function Landing() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <main className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-3 space-y-8">
              <h1 className="text-4xl lg:text-5xl font-semibold text-stone-900 leading-[1.1] tracking-tight">
                Free online writing tool
              </h1>

              <p className="text-lg text-stone-600 leading-relaxed max-w-md">
                A distraction-free writing space that works in your browser.
                No downloads, no sign-up required. Just open and write.
              </p>

              <Button
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-stone-900 hover:bg-stone-800 text-white px-8 h-12 text-base font-medium"
                data-testid="button-start-writing"
              >
                Start writing free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-sm text-stone-500">
                No account needed · Works offline · Your data stays private
              </p>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden shadow-lg border border-stone-200">
                <img
                  src={appIllustration}
                  alt="Free online writing tool interface showing a clean distraction-free editor"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* What you can do */}
      <section className="border-t border-stone-200 bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-stone-900 mb-10">
              Everything you need to write online
            </h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div>
                <h3 className="font-medium text-stone-900 mb-2">Distraction-free editor</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Clean interface with no clutter. Full keyboard shortcuts for formatting.
                  Timer for focused writing sessions.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-stone-900 mb-2">Organize with tags</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Add tags to your writing. Filter entries instantly.
                  Keep journals, notes, and drafts separate.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-stone-900 mb-2">Export anywhere</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Download as Markdown, JSON, or plain text.
                  Copy formatted text directly to ChatGPT or any app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-stone-200 bg-stone-50">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-stone-900 mb-10">
              Write anything, anywhere
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex gap-3">
                <span className="text-stone-400">—</span>
                <div>
                  <p className="text-stone-900 font-medium">Daily journaling</p>
                  <p className="text-stone-600 text-sm">Capture thoughts and reflections every day</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-stone-400">—</span>
                <div>
                  <p className="text-stone-900 font-medium">Morning pages</p>
                  <p className="text-stone-600 text-sm">Stream of consciousness writing to clear your mind</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-stone-400">—</span>
                <div>
                  <p className="text-stone-900 font-medium">Blog drafts</p>
                  <p className="text-stone-600 text-sm">Write posts in Markdown, export when ready</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-stone-400">—</span>
                <div>
                  <p className="text-stone-900 font-medium">Meeting notes</p>
                  <p className="text-stone-600 text-sm">Quick capture with tags for easy retrieval</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-stone-400">—</span>
                <div>
                  <p className="text-stone-900 font-medium">Creative writing</p>
                  <p className="text-stone-600 text-sm">Stories, poems, ideas—all in one place</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-stone-400">—</span>
                <div>
                  <p className="text-stone-900 font-medium">AI prompts</p>
                  <p className="text-stone-600 text-sm">Draft and organize prompts, export to ChatGPT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why free */}
      <section className="border-t border-stone-200 bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                Why is this writing tool free?
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Writing should be accessible to everyone. This tool runs entirely in your browser
                with optional cloud sync. No ads, no premium tiers, no feature gates.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Your writing stays on your device by default. Enable sync only if you want
                access across devices. We believe the best online writing tool is one that
                respects your privacy and gets out of your way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-stone-200 bg-stone-900">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Start writing now
            </h2>
            <p className="text-stone-400 mb-8 max-w-md mx-auto">
              No sign-up. No download. Just click and write.
            </p>
            <Button
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-white hover:bg-stone-100 text-stone-900 px-8 h-12 text-base font-medium"
              data-testid="button-start-writing-bottom"
            >
              Open the writing tool
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-900 py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-stone-500">
              Free Writing Tool · Open source
            </p>
            <p className="text-sm text-stone-500">
              A free online writing tool for journals, notes, and creative writing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}