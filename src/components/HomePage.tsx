import React, { useState } from 'react';
import { Shield, Globe, Zap, Users, Heart, Star, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onAnalyze, isLoading, error }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateURL = (input: string): boolean => {
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setIsValid(false);
      return;
    }

    const urlToTest = trimmedUrl.match(/^https?:\/\//) ? trimmedUrl : `https://${trimmedUrl}`;
    
    if (validateURL(urlToTest)) {
      setIsValid(true);
      onAnalyze(urlToTest);
    } else {
      setIsValid(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (!isValid) setIsValid(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI-Powered Accessibility Tester
              </h1>
              <p className="text-gray-600">Comprehensive website accessibility analysis with AI-generated solutions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">For Everyone</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium">WCAG Compliant</span>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Make the Web
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
              Accessible for Everyone
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Get comprehensive accessibility analysis with AI-powered explanations, intelligent alt text generation, 
            and step-by-step solutions to make your website inclusive for all users.
          </p>
        </div>

        {/* URL Input Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Website Analysis</h3>
                <p className="text-gray-600">Enter a URL to analyze its accessibility with AI</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className={`w-full px-6 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    !isValid || error
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 bg-white'
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {(!isValid || error) && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{error || 'Please enter a valid URL (e.g., https://example.com)'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing with AI...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span>Analyze with AI</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Powered Analysis Includes:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>AI-generated alt text for images</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Smart form label suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Color contrast analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Intelligent code fixes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Plain-language explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>WCAG compliance checking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Generated Solutions</h3>
            <p className="text-gray-600">Get intelligent alt text, form labels, and code fixes powered by advanced AI models.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Human-Friendly Explanations</h3>
            <p className="text-gray-600">Understand accessibility issues with clear, jargon-free explanations of their impact.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">WCAG Compliance</h3>
            <p className="text-gray-600">Ensure your website meets WCAG 2.1 AA/AAA standards with comprehensive testing.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Built with ❤️ for web accessibility • Powered by Together.ai</p>
            <p className="text-sm">
              Helping developers create inclusive experiences for everyone • WCAG 2.1 AA/AAA Guidelines
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};