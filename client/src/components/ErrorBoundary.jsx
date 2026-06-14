import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mb-3" strokeWidth={1.5} />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Something went wrong</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
