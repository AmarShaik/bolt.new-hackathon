import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Zap, Book, ExternalLink } from 'lucide-react';
import { AccessibilityIssue } from '../types/accessibility';
import { PriorityBadge } from './PriorityBadge';
import { CodeSnippet } from './CodeSnippet';

interface IssueCardProps {
  issue: AccessibilityIssue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyConfig = {
    easy: { color: 'text-green-600', icon: '🟢', label: 'Easy Fix' },
    medium: { color: 'text-yellow-600', icon: '🟡', label: 'Medium Effort' },
    hard: { color: 'text-red-600', icon: '🔴', label: 'Complex Fix' }
  };

  const difficulty = difficultyConfig[issue.solution.difficulty];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <PriorityBadge severity={issue.severity} />
              <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
            </div>
            
            <p className="text-gray-700 mb-3">{issue.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span className={difficulty.color}>
                  {difficulty.icon} {difficulty.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{issue.solution.estimatedTime}</span>
              </div>
              {issue.wcagReference && (
                <div className="flex items-center gap-1">
                  <Book className="w-4 h-4" />
                  <span>{issue.wcagReference}</span>
                </div>
              )}
            </div>

            {issue.element && (
              <div className="mt-3 p-2 bg-gray-100 rounded text-sm font-mono text-gray-700">
                {issue.element.length > 100 ? `${issue.element.substring(0, 100)}...` : issue.element}
              </div>
            )}
          </div>
          
          <button className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="space-y-6">
            {/* Impact Explanation */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-blue-600">👥</span>
                Impact on Users
              </h4>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                {issue.impact}
              </p>
            </div>

            {/* Solution Steps */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-green-600">🛠️</span>
                How to Fix This
              </h4>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-gray-700 mb-4">{issue.solution.description}</p>
                
                <h5 className="font-medium text-gray-900 mb-2">Step-by-step instructions:</h5>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  {issue.solution.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Code Examples */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-purple-600">💻</span>
                Code Example
              </h4>
              <CodeSnippet 
                before={issue.solution.codeExample.before}
                after={issue.solution.codeExample.after}
              />
            </div>

            {/* Alternative Solutions */}
            {issue.solution.alternatives && issue.solution.alternatives.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-orange-600">🔄</span>
                  Alternative Approaches
                </h4>
                <ul className="space-y-2">
                  {issue.solution.alternatives.map((alt, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* WCAG Reference */}
            {issue.wcagReference && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <ExternalLink className="w-4 h-4" />
                <a 
                  href={`https://www.w3.org/WAI/WCAG21/Understanding/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Learn more about {issue.wcagReference}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};