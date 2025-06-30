import React, { useState } from 'react';
import { Search, AlertCircle, Globe } from 'lucide-react';

interface URLInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const URLInput: React.FC<URLInputProps> = ({ onAnalyze, isLoading, error }) => {
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

    // Add https:// if no protocol is specified
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
          <Globe className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Website Analysis</h2>
          <p className="text-gray-600">Enter a URL to analyze its accessibility</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className={`w-full px-4 py-3 pl-12 text-lg border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isValid || error
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {(!isValid || error) && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error || 'Please enter a valid URL (e.g., https://example.com)'}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing Website...</span>
            </div>
          ) : (
            'Analyze Accessibility'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">What we analyze:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Color contrast and readability</li>
          <li>• Image alt text and descriptions</li>
          <li>• Heading structure and navigation</li>
          <li>• Form labels and accessibility</li>
          <li>• ARIA labels and semantic HTML</li>
        </ul>
      </div>
    </div>
  );
};