import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Edit3, Tag, Upload, Zap, FileText, MessageSquare } from "lucide-react";
import { useEffect } from "react";
import appIllustration from "@assets/generated_images/Writing_app_interface_illustration_9ca83be2.png";

export function Landing() {
  useEffect(() => {
    // SEO optimizations
    document.title = "Free Writing Tool - Focus, Organize & Export Your Ideas Instantly";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover the best free writing tool for focused writing. Organize ideas with smart tags and export directly to ChatGPT. Start writing distraction-free today.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover the best free writing tool for focused writing. Organize ideas with smart tags and export directly to ChatGPT. Start writing distraction-free today.';
      document.head.appendChild(meta);
    }

    // Open Graph tags for social sharing
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Free Writing Tool - Focus, Organize & Export Your Ideas');
    if (!document.querySelector('meta[property="og:title"]')) document.head.appendChild(ogTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'The ultimate free writing tool for focused writing, smart organization with tags, and instant ChatGPT export.');
    if (!document.querySelector('meta[property="og:description"]')) document.head.appendChild(ogDescription);

    return () => {
      document.title = "Free writing";
    };
  }, []);

  const features = [
    {
      icon: <Edit3 className="w-6 h-6 text-blue-600" />,
      title: "Pure Focus on Writing",
      description: "Distraction-free editor designed for deep, focused writing sessions with elegant typography and clean interface."
    },
    {
      icon: <Tag className="w-6 h-6 text-green-600" />,
      title: "Smart Tag Organization",
      description: "Quickly organize your ideas with intuitive tags. Add, filter, and find your thoughts instantly with our smart tagging system."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      title: "Quick ChatGPT Export",
      description: "Export your writing directly to ChatGPT with one click. Perfect for getting AI feedback, editing, or continuing your ideas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-blue-700 bg-blue-100 border-blue-200">
                <Zap className="w-3 h-3 mr-1" />
                100% Free Writing Tool
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Focus on Writing.
                <span className="text-blue-600 block">Organize with Tags.</span>
                <span className="text-gray-700 block text-3xl lg:text-4xl">Export to ChatGPT.</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                The ultimate free writing tool for writers who want to focus on their ideas. 
                Organize thoughts with smart tags and export directly to ChatGPT for AI assistance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                data-testid="button-start-writing"
              >
                Start Writing Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-gray-300 hover:border-blue-300 px-8 py-3 text-lg font-semibold"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>No signup required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Always free</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Instant export</span>
              </div>
            </div>
          </div>

          {/* Right Column - App Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <img 
                src={appIllustration} 
                alt="Free writing tool interface showing focused writing with tag organization and ChatGPT export"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Why Choose Our Free Writing Tool?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built for writers who value simplicity, organization, and seamless AI integration. 
                Everything you need to capture and develop your ideas.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 p-6">
                  <CardContent className="p-0 space-y-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Transform Your Writing?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of writers using the best free writing tool for focused, organized writing.
            </p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
              data-testid="button-get-started-cta"
            >
              Get Started - It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            <strong>Free writing</strong> - The ultimate free writing tool for focused writers
          </p>
        </div>
      </div>
    </div>
  );
}