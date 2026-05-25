import { Component } from 'react';

/**
 * ErrorBoundary — Class Component
 *
 * Hooks KHÔNG thể bắt lỗi render → phải dùng Class Component.
 * Đây là một trong số ít trường hợp bắt buộc dùng class trong React hiện đại.
 *
 * Lifecycle methods dùng ở đây:
 *   - static getDerivedStateFromError(error): cập nhật state để hiện fallback UI
 *   - componentDidCatch(error, info): log error (Sentry, Datadog, ...)
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Chạy khi có lỗi trong cây con → trả state mới để render fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Đây là nơi gọi error reporting service (Sentry, etc.)
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="error-boundary">
          <div className="eb-window">
            <div className="eb-bar">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="terminal-title">error.log</span>
            </div>
            <div className="eb-body">
              <p className="eb-title">
                <span style={{ color: 'var(--red)' }}>✖ </span>
                Something went wrong
              </p>
              <pre className="eb-msg">
                {this.state.error?.message ?? 'Unknown error'}
              </pre>
              <button className="eb-btn" onClick={this.handleReset}>
                ↺ Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
