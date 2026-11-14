import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="card-depth-3d max-w-md w-full p-6 text-center bg-white space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-md">
              <AlertCircle size={30} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Something went wrong</h2>
              <p className="text-xs text-slate-500 mt-1">
                {this.state.error?.message || 'An unexpected rendering error occurred'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="btn-3d btn-3d-indigo text-xs px-4 py-2 flex items-center gap-1.5"
              >
                <RefreshCw size={14} /> Refresh Page
              </button>
              <a
                href="/dashboard"
                className="btn-3d btn-3d-slate text-xs px-4 py-2 flex items-center gap-1.5"
              >
                <Home size={14} /> Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
