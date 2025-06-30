import React from 'react';
import { CheckCircle, Circle, Zap } from 'lucide-react';

interface LoadingProgressProps {
  progress: number;
  currentStep: string;
}

const analysisSteps = [
  'Fetching website content',
  'Parsing HTML structure',
  'Analyzing accessibility issues',
  'Generating AI explanations',
  'Creating code suggestions',
  'Calculating accessibility score',
  'Compiling final report'
];

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ progress, currentStep }) => {
  const currentStepIndex = analysisSteps.findIndex(step => step === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
            <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">AI Analysis in Progress</h2>
          <p className="text-gray-600">Please wait while we perform comprehensive accessibility analysis</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          {analysisSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              {index < currentStepIndex ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : index === currentStepIndex ? (
                <div className="w-5 h-5 flex-shrink-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
              )}
              <span className={`text-sm ${
                index <= currentStepIndex ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            <Zap className="w-4 h-4 inline mr-1" />
            Powered by Together.ai for intelligent accessibility insights
          </p>
        </div>
      </div>
    </div>
  );
};