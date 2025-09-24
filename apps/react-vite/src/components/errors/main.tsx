import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

interface ErrorInfo {
  message?: string;
  stack?: string;
  componentStack?: string;
}

interface MainErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails?: boolean;
}

export const MainErrorFallback = ({ 
  error, 
  errorInfo, 
  showDetails = process.env.NODE_ENV === 'development' 
}: MainErrorFallbackProps) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showDetailedError, setShowDetailedError] = useState(showDetails);

  // Log error for monitoring (in production, this would go to error tracking service)
  useEffect(() => {
    if (error) {
      console.error('MainErrorFallback caught error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  }, [error, errorInfo]);

  const handleRefresh = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Add small delay to show loading state
    setTimeout(() => {
      window.location.assign(window.location.origin);
    }, 500);
  };

  const handleReportError = () => {
    // In a real application, this would send error details to monitoring service
    const errorReport = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      retryCount,
    };
    
    console.log('Error report:', errorReport);
    alert('Error report logged. Thank you for helping us improve!');
  };

  const toggleErrorDetails = () => {
    setShowDetailedError(prev => !prev);
  };

  return (
    <div 
      className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 px-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg 
              className="h-8 w-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          We're sorry for the inconvenience. The application encountered an unexpected error.
        </p>

        {/* Conditional Error Details */}
        {showDetailedError && error && (
          <details className="mb-6 text-left bg-gray-100 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              Error Details
            </summary>
            <div className="text-xs font-mono text-red-600 whitespace-pre-wrap break-all">
              <div className="mb-2">
                <strong>Message:</strong> {error.message}
              </div>
              {error.stack && (
                <div className="mb-2">
                  <strong>Stack:</strong>
                  <pre className="mt-1 max-h-32 overflow-y-auto">{error.stack}</pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="mt-1 max-h-32 overflow-y-auto">{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleRefresh}
            disabled={isRetrying}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby={retryCount > 0 ? 'retry-count' : undefined}
          >
            {isRetrying ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              'Try Again'
            )}
          </Button>

          {retryCount > 0 && (
            <p id="retry-count" className="text-sm text-gray-500">
              Retry attempt: {retryCount}
            </p>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleReportError}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Report Issue
            </Button>
            
            {error && (
              <Button
                onClick={toggleErrorDetails}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                aria-expanded={showDetailedError}
                aria-controls="error-details"
              >
                {showDetailedError ? 'Hide' : 'Show'} Details
              </Button>
            )}
          </div>

          <Button
            onClick={() => window.location.href = '/'}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-800"
          >
            ← Go Home
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-xs text-gray-500">
          If this problem persists, please contact support or try refreshing the page.
        </p>
      </div>
    </div>
  );
};

// Export additional error handling utilities
export const withErrorFallback = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <ErrorBoundary fallback={MainErrorFallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Simple Error Boundary component for wrapping
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<any> },
  { hasError: boolean; error?: Error; errorInfo?: any }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ComponentType<any> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          errorInfo={this.state.errorInfo} 
        />
      );
    }

    return this.props.children;
  }
}
