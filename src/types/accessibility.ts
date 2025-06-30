export interface AccessibilityIssue {
  id?: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  element: string;
  explanation?: string;
  suggestedAltText?: string;
  suggestedLabel?: string;
  suggestedText?: string;
  fixedCode?: string;
  src?: string;
  href?: string;
  inputType?: string;
  inputName?: string;
}

export interface AccessibilityReport {
  url: string;
  analyzedAt: string;
  overallScore: number;
  issueCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  issues: AccessibilityIssue[];
  estimatedFixTime: string;
  totalIssues: number;
}

export interface AnalysisState {
  isLoading: boolean;
  report: AccessibilityReport | null;
  error: string | null;
  progress: number;
}