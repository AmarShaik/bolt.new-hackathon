import React from 'react';
import { AccessibilityReport } from '../types/accessibility';
import { PriorityBadge } from './PriorityBadge';
import { TrendingUp, Clock, Award, AlertTriangle } from 'lucide-react';

interface ResultsOverviewProps {
  report: AccessibilityReport;
}

export const ResultsOverview: React.FC<ResultsOverviewProps> = ({ report }) => {
  const totalIssues = Object.values(report.issueCount).reduce((sum, count) => sum + count, 0);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accessibility Report</h2>
          <p className="text-gray-600 mt-1">
            Analysis completed for <span className="font-medium">{report.url}</span>
          </p>
          <p className="text-sm text-gray-500">
            {report.analyzedAt.toLocaleDateString()} at {report.analyzedAt.toLocaleTimeString()}
          </p>
        </div>
        
        <div className={`flex items-center justify-center w-20 h-20 rounded-full ${getScoreBackground(report.overallScore)}`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
              {report.overallScore}
            </div>
            <div className="text-xs text-gray-600">Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-semibold text-lg">{report.issueCount.critical}</p>
              <p className="text-red-600 text-sm">Critical Issues</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-800 font-semibold text-lg">{report.issueCount.high}</p>
              <p className="text-orange-600 text-sm">High Priority</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-semibold text-lg">{report.issueCount.medium}</p>
              <p className="text-yellow-600 text-sm">Medium Priority</p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-semibold text-lg">{report.issueCount.low}</p>
              <p className="text-blue-600 text-sm">Low Priority</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Summary</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Estimated fix time: {report.estimatedFixTime}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Total issues found:</span> {totalIssues}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Accessibility score:</span> {report.overallScore}/100
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Priority focus:</span>{' '}
              {report.issueCount.critical > 0 ? 'Fix critical issues first' : 
               report.issueCount.high > 0 ? 'Address high priority items' : 
               'Good foundation, improve details'}
            </p>
          </div>
        </div>

        {report.recommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Key Recommendations:</h4>
            <ul className="space-y-1">
              {report.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};