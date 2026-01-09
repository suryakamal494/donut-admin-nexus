import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class LazyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lazy loading error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    // Force a re-render which will attempt to reload the lazy component
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Failed to load page
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            There was a problem loading this page. This might be due to a network issue.
          </p>
          <Button onClick={this.handleRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyErrorBoundary;
