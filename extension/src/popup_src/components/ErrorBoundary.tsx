import React from "react";

/**
 * ErrorBoundary: Catches errors in React children, logs to console, and shows fallback UI.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 p-4 rounded border border-red-400 text-red-800">
          <div className="font-bold mb-2">Something went wrong.</div>
          <div className="text-sm">{this.state.errorInfo}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;