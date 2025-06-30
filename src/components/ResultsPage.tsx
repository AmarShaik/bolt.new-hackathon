import React, { useState } from 'react';
import { ArrowLeft, Download, RotateCcw, TrendingUp, Clock, Award, AlertTriangle, Copy, Check, ExternalLink } from 'lucide-react';
import { AccessibilityReport, AccessibilityIssue } from '../types/accessibility';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultsPageProps {
  report: AccessibilityReport;
  onBackToHome: () => void;
  onScanAnother: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ report, onBackToHome, onScanAnother }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const filteredIssues = report.issues.filter(issue => 
    !selectedSeverity || issue.severity === selectedSeverity
  );

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

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadReport = () => {
    const reportData = {
      url: report.url,
      analyzedAt: report.analyzedAt,
      overallScore: report.overallScore,
      issueCount: report.issueCount,
      estimatedFixTime: report.estimatedFixTime,
      issues: report.issues.map(issue => ({
        type: issue.type,
        severity: issue.severity,
        explanation: issue.explanation,
        fixedCode: issue.fixedCode
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Data for charts
  const pieData = [
    { name: 'Critical', value: report.issueCount.critical, color: '#dc2626' },
    { name: 'High', value: report.issueCount.high, color: '#ea580c' },
    { name: 'Medium', value: report.issueCount.medium, color: '#d97706' },
    { name: 'Low', value: report.issueCount.low, color: '#2563eb' }
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Critical', issues: report.issueCount.critical, time: report.issueCount.critical * 30 },
    { name: 'High', issues: report.issueCount.high, time: report.issueCount.high * 20 },
    { name: 'Medium', issues: report.issueCount.medium, time: report.issueCount.medium * 10 },
    { name: 'Low', issues: report.issueCount.low, time: report.issueCount.low * 5 }
  ];

  const filters = [
    { severity: null, label: 'All Issues', count: report.totalIssues },
    { severity: 'critical', label: 'Critical', count: report.issueCount.critical },
    { severity: 'high', label: 'High', count: report.issueCount.high },
    { severity: 'medium', label: 'Medium', count: report.issueCount.medium },
    { severity: 'low', label: 'Low', count: report.issueCount.low },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
              
              <button
                onClick={onScanAnother}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Scan Another</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Results Overview */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Accessibility Report</h1>
              <p className="text-gray-600 mt-1">
                Analysis completed for <span className="font-medium">{report.url}</span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(report.analyzedAt).toLocaleDateString()} at {new Date(report.analyzedAt).toLocaleTimeString()}
              </p>
            </div>
            
            <div className={`flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(report.overallScore)}`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore}
                </div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-800 font-semibold text-xl">{report.issueCount.critical}</p>
                  <p className="text-red-600 text-sm">Critical Issues</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-800 font-semibold text-xl">{report.issueCount.high}</p>
                  <p className="text-orange-600 text-sm">High Priority</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-800 font-semibold text-xl">{report.issueCount.medium}</p>
                  <p className="text-yellow-600 text-sm">Medium Priority</p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-semibold text-xl">{report.issueCount.low}</p>
                  <p className="text-blue-600 text-sm">Low Priority</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Charts */}
          {report.totalIssues > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Priority</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Fix Time (minutes)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="time" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Summary</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Estimated fix time: {report.estimatedFixTime}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-700">
              <p className="mb-2">
                <span className="font-medium">Total issues found:</span> {report.totalIssues}
              </p>
              <p>
                <span className="font-medium">Priority focus:</span>{' '}
                {report.issueCount.critical > 0 ? 'Fix critical issues immediately' : 
                 report.issueCount.high > 0 ? 'Address high priority items' : 
                 'Good foundation, improve details'}
              </p>
            </div>
          </div>
        </div>

        {/* Issue Filters */}
        {report.totalIssues > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Priority</h3>
            
            <div className="flex flex-wrap gap-3">
              {filters.map(({ severity, label, count }) => (
                <button
                  key={severity || 'all'}
                  onClick={() => setSelectedSeverity(severity)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedSeverity === severity
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{label} ({count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Issues List */}
        {report.totalIssues > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedSeverity 
                  ? `${selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)} Priority Issues` 
                  : 'All Issues'
                } ({filteredIssues.length})
              </h2>
            </div>

            {filteredIssues.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-gray-400 mb-4">
                  <AlertTriangle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found in this category</h3>
                <p className="text-gray-600">Try selecting a different priority level to see other issues.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIssues.map((issue, index) => (
                  <IssueCard key={index} issue={issue} onCopy={copyToClipboard} copiedStates={copiedStates} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-green-500 mb-4">
              <Award className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellent Accessibility!</h3>
            <p className="text-gray-600 mb-6">No major accessibility issues were found. Your website appears to be well-optimized for all users.</p>
            <button 
              onClick={onScanAnother}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Analyze Another Website
            </button>
          </div>
        )}

        {/* Scan Another Section */}
        {report.totalIssues > 0 && (
          <div className="mt-12 text-center">
            <button 
              onClick={onScanAnother}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Scan Another Website
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

// Issue Card Component
interface IssueCardProps {
  issue: AccessibilityIssue;
  onCopy: (text: string, id: string) => void;
  copiedStates: { [key: string]: boolean };
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onCopy, copiedStates }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityConfig = {
    critical: { color: 'bg-red-100 text-red-800 border-red-200', icon: '🚨' },
    high: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '⚠️' },
    medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⚡' },
    low: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'ℹ️' }
  };

  const config = severityConfig[issue.severity];

  const getIssueTitle = (type: string) => {
    const titles = {
      'missing-alt-text': 'Missing Alt Text',
      'missing-form-label': 'Missing Form Label',
      'empty-link': 'Empty Link',
      'missing-headings': 'Missing Headings',
      'improper-heading-structure': 'Improper Heading Structure',
      'missing-page-title': 'Missing Page Title',
      'missing-lang-attribute': 'Missing Language Attribute'
    };
    return titles[type] || 'Accessibility Issue';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
                <span>{config.icon}</span>
                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">{getIssueTitle(issue.type)}</h3>
            </div>
            
            {issue.explanation && (
              <p className="text-gray-700 mb-3">{issue.explanation}</p>
            )}

            <div className="bg-gray-100 rounded p-3 text-sm font-mono text-gray-700">
              <div className="text-xs text-gray-500 mb-1">Current code:</div>
              {issue.element.length > 150 ? `${issue.element.substring(0, 150)}...` : issue.element}
            </div>
          </div>
          
          <button className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && issue.fixedCode && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-700">✅ AI-Generated Fix</h4>
                <button
                  onClick={() => onCopy(issue.fixedCode!, `fix-${issue.type}`)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors bg-white rounded border"
                >
                  {copiedStates[`fix-${issue.type}`] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedStates[`fix-${issue.type}`] ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <pre className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm overflow-x-auto">
                <code className="text-green-800">{issue.fixedCode}</code>
              </pre>
            </div>

            {(issue.suggestedAltText || issue.suggestedLabel || issue.suggestedText) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">💡 AI Suggestion:</h5>
                <p className="text-blue-800 text-sm">
                  {issue.suggestedAltText || issue.suggestedLabel || issue.suggestedText}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};