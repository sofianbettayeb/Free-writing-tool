import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import appIllustration from "@assets/generated_images/Writing_app_interface_illustration_9ca83be2.png";

export function Landing() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero - Single focused section */}
      <main className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Left-aligned content - avoids AI "centered everything" pattern */}
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-3 space-y-8">
              <h1 className="text-4xl lg:text-5xl font-semibold text-stone-900 leading-[1.1] tracking-tight">
                Write without
                <br />
                distractions
              </h1>

              <p className="text-lg text-stone-600 leading-relaxed max-w-md">
                A clean space for your thoughts. Organize with tags,
                export anywhere—including ChatGPT.
              </p>

              <Button
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-stone-900 hover:bg-stone-800 text-white px-8 h-12 text-base font-medium"
                data-testid="button-start-writing"
              >
                Start writing
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-sm text-stone-500">
                Free forever · No account needed
              </p>
            </div>

            {/* App preview - cleaner presentation */}
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden shadow-lg border border-stone-200">
                <img
                  src={appIllustration}
                  alt="Writing interface preview"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple feature list - no cards, no icons */}
      <section className="border-t border-stone-200 bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div>
                <h3 className="font-medium text-stone-900 mb-2">Focus mode</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Distraction-free editor with keyboard shortcuts. Just write.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-stone-900 mb-2">Tag organization</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Add tags to entries. Click to filter. Find anything fast.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-stone-900 mb-2">Export anywhere</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Markdown, JSON, plain text—or copy directly to ChatGPT.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-stone-200 py-6">
        <div className="container mx-auto px-6">
          <p className="text-sm text-stone-500 text-center">
            Free Writing · Open source
          </p>
        </div>
      </footer>
    </div>
  );
}