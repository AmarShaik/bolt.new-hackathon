import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface PriorityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  count?: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ severity, count }) => {
  const config = {
    critical: {
      icon: AlertTriangle,
      label: 'Critical',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    high: {
      icon: AlertCircle,
      label: 'High',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600'
    },
    medium: {
      icon: Info,
      label: 'Medium',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    low: {
      icon: CheckCircle,
      label: 'Low',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const { icon: Icon, label, bgColor, textColor, iconColor } = config[severity];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
      {label}
      {count !== undefined && <span className="ml-1">({count})</span>}
    </span>
  );
};