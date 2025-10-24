import React, { Component, ReactNode } from 'react';
import { SpotifyAPIError } from '../api/spotify';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary">
                    <div className="error-boundary__content">
                        <h2>Oops! Something went wrong</h2>
                        <p>
                            {this.state.error instanceof SpotifyAPIError
                                ? `Spotify API Error: ${this.state.error.message}`
                                : 'An unexpected error occurred'}
                        </p>
                        <button 
                            onClick={() => this.setState({ hasError: false, error: undefined })}
                            className="error-boundary__retry-btn"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional component for API errors
interface ErrorMessageProps {
    error: Error | null;
    onRetry?: () => void;
    className?: string;
}

export function ErrorMessage({ error, onRetry, className = '' }: ErrorMessageProps) {
    if (!error) return null;

    const isSpotifyError = error instanceof SpotifyAPIError;
    const isNetworkError = error.message.includes('Network error');
    const isRateLimited = isSpotifyError && error.status === 429;

    let title = 'Something went wrong';
    let message = error.message;
    let actionText = 'Try Again';

    if (isNetworkError) {
        title = 'Connection Problem';
        message = 'Please check your internet connection and try again.';
    } else if (isRateLimited) {
        title = 'Too Many Requests';
        message = 'Please wait a moment before trying again.';
        actionText = 'Retry';
    } else if (isSpotifyError && error.status === 404) {
        title = 'Not Found';
        message = 'The requested content could not be found.';
        actionText = 'Go Back';
    }

    return (
        <div className={`error-message ${className}`}>
            <div className="error-message__content">
                <h3 className="error-message__title">{title}</h3>
                <p className="error-message__text">{message}</p>
                {onRetry && (
                    <button 
                        onClick={onRetry}
                        className="error-message__retry-btn"
                    >
                        {actionText}
                    </button>
                )}
            </div>
        </div>
    );
}
