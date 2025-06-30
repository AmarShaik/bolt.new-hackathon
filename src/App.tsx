import { HomePage } from './components/HomePage';
import { ResultsPage } from './components/ResultsPage';
import { LoadingProgress } from './components/LoadingProgress';
import { useAccessibilityAnalysis } from './hooks/useAccessibilityAnalysis';

function App() {
  const {
    isLoading,
    report,
    error,
    progress,
    currentStep,
    analyzeWebsite,
    resetAnalysis
  } = useAccessibilityAnalysis();

  const handleBackToHome = () => {
    resetAnalysis();
  };

  const handleScanAnother = () => {
    resetAnalysis();
  };

  const renderMainContent = () => {
    if (isLoading) {
      return <LoadingProgress progress={progress} currentStep={currentStep} />;
    }

    if (report) {
      return (
        <ResultsPage
          report={report}
          onBackToHome={handleBackToHome}
          onScanAnother={handleScanAnother}
        />
      );
    }

    return (
      <HomePage
        onAnalyze={analyzeWebsite}
        isLoading={isLoading}
        error={error}
      />
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'space-between'
    }}>
      <div style={{ flexGrow: 1 }}>
        {renderMainContent()}
      </div>

      <footer style={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '1rem',
        borderTop: '1px solid #eee'
      }}>
        <a
          href="https://bolt.fun"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: '#333'
          }}
        >
          <img
            src="https://img.shields.io/badge/Built%20with-Bolt.new-blue?style=for-the-badge&logo=thunder-wave"
            alt="Built with Bolt.new"
            height="30"
          />
        </a>
      </footer>
    </div>
  );
}

export default App;
