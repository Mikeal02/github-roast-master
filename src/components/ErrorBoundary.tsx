import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  /** Optional custom fallback renderer. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Label used in logs to identify which boundary tripped. */
  name?: string;
}

interface State {
  error: Error | null;
  count: number;
}

/**
 * Production-grade error boundary: catches render/runtime errors in the React
 * tree, reports them, and offers recovery without a full page reload.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, count: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to console for log capture / monitoring pipelines.
    console.error(
      `[ErrorBoundary${this.props.name ? `:${this.props.name}` : ""}]`,
      error,
      info.componentStack,
    );
  }

  reset = () => {
    this.setState((s) => ({ error: null, count: s.count + 1 }));
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div
        role="alert"
        className="min-h-[60vh] flex items-center justify-center p-6"
      >
        <div className="glass-panel max-w-md w-full p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground break-words">
            {error.message || "An unexpected error occurred."}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button onClick={this.reset} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/";
              }}
              className="gap-2"
            >
              <Home className="w-4 h-4" /> Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
