import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-10">
          <div className="text-center max-w-md">
            <div style={{ fontSize: 48, marginBottom: 8 }}>⚠️</div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0A2540" }}>Something went wrong</h1>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 8, lineHeight: 1.5 }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-6 h-10 px-6 rounded-xl bg-[#0A2540] text-white text-sm font-medium hover:bg-[#0F3057] transition"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
