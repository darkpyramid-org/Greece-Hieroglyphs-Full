/**
 * Top-level error boundary.
 *
 * Without this, a render error in any page unmounts the entire React tree and
 * the visitor is left staring at a blank page (this is exactly what happened when
 * `pages/faq.tsx` used `motion` without importing it).
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the stack in the console for debugging; there is no error reporter
    // wired up in this project yet.
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#1B1B1B",
          background: "#FDF8EF",
        }}
      >
        <span style={{ fontSize: "3rem", opacity: 0.3 }}>𓂀</span>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ maxWidth: "32rem", margin: 0, opacity: 0.7 }}>
          An unexpected error stopped this page from rendering. You can try
          again, or head back to the storefront.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={this.reset}
            style={{
              padding: "0.625rem 1.25rem",
              background: "#1B1B1B",
              color: "#FDF8EF",
              border: 0,
              borderRadius: "0.5rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: "0.625rem 1.25rem",
              background: "transparent",
              color: "#1B1B1B",
              border: "1px solid rgba(27,27,27,0.2)",
              borderRadius: "0.5rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;