import { useState, useCallback } from 'react';
import { AnalysisState, AccessibilityReport } from '../types/accessibility';

const API_BASE_URL = 'http://localhost:3001';

const simulateAnalysisSteps = [
  'Fetching website content',
  'Parsing HTML structure',
  'Analyzing accessibility issues',
  'Generating AI explanations',
  'Creating code suggestions',
  'Calculating accessibility score',
  'Compiling final report'
];

export const useAccessibilityAnalysis = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    report: null,
    error: null,
    progress: 0
  });

  const [currentStep, setCurrentStep] = useState('');

  const simulateProgressSteps = useCallback(async (): Promise<void> => {
    for (let i = 0; i < simulateAnalysisSteps.length; i++) {
      setCurrentStep(simulateAnalysisSteps[i]);
      setState(prev => ({ ...prev, progress: ((i + 1) / simulateAnalysisSteps.length) * 90 }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }, []);

  const analyzeWebsite = useCallback(async (url: string): Promise<void> => {
    setState({
      isLoading: true,
      report: null,
      error: null,
      progress: 0
    });

    try {
      // Start progress simulation
      const progressPromise = simulateProgressSteps();

      // Call backend API
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const report: AccessibilityReport = await response.json();

      // Wait for progress to complete
      await progressPromise;

      // Final progress update
      setState(prev => ({ ...prev, progress: 100 }));
      await new Promise(resolve => setTimeout(resolve, 500));

      setState({
        isLoading: false,
        report,
        error: null,
        progress: 100
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      setState({
        isLoading: false,
        report: null,
        error: error instanceof Error ? error.message : 'An unexpected error occurred during analysis.',
        progress: 0
      });
    }
  }, [simulateProgressSteps]);

  const resetAnalysis = useCallback(() => {
    setState({
      isLoading: false,
      report: null,
      error: null,
      progress: 0
    });
    setCurrentStep('');
  }, []);

  return {
    ...state,
    currentStep,
    analyzeWebsite,
    resetAnalysis
  };
};