import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeSnippetProps {
  before: string;
  after: string;
  language?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ before, after, language = 'html' }) => {
  const [copiedBefore, setCopiedBefore] = useState(false);
  const [copiedAfter, setCopiedAfter] = useState(false);

  const copyToClipboard = async (text: string, type: 'before' | 'after') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'before') {
        setCopiedBefore(true);
        setTimeout(() => setCopiedBefore(false), 2000);
      } else {
        setCopiedAfter(true);
        setTimeout(() => setCopiedAfter(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-red-700">❌ Before (Problematic)</h4>
          <button
            onClick={() => copyToClipboard(before, 'before')}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            {copiedBefore ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedBefore ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm overflow-x-auto">
          <code className="text-red-800">{before}</code>
        </pre>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-green-700">✅ After (Accessible)</h4>
          <button
            onClick={() => copyToClipboard(after, 'after')}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            {copiedAfter ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedAfter ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm overflow-x-auto">
          <code className="text-green-800">{after}</code>
        </pre>
      </div>
    </div>
  );
};