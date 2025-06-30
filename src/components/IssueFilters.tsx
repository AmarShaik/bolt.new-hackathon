import React from 'react';
import { PriorityBadge } from './PriorityBadge';

interface IssueFiltersProps {
  selectedSeverity: string | null;
  onSeverityChange: (severity: string | null) => void;
  issueCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const IssueFilters: React.FC<IssueFiltersProps> = ({ 
  selectedSeverity, 
  onSeverityChange, 
  issueCounts 
}) => {
  const filters = [
    { severity: null, label: 'All Issues', count: Object.values(issueCounts).reduce((sum, count) => sum + count, 0) },
    { severity: 'critical', label: 'Critical', count: issueCounts.critical },
    { severity: 'high', label: 'High', count: issueCounts.high },
    { severity: 'medium', label: 'Medium', count: issueCounts.medium },
    { severity: 'low', label: 'Low', count: issueCounts.low },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Priority</h3>
      
      <div className="flex flex-wrap gap-3">
        {filters.map(({ severity, label, count }) => (
          <button
            key={severity || 'all'}
            onClick={() => onSeverityChange(severity)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              selectedSeverity === severity
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {severity ? (
              <PriorityBadge severity={severity as any} />
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                All Issues
              </span>
            )}
            <span className="font-medium">({count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};