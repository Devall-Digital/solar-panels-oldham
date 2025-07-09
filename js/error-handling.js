// Solar Panels Oldham - Error Handling Module
// Provides global error boundaries, graceful degradation, and user-friendly error messages

(function() {
    'use strict';

    // Configuration
    const maxErrors = 5; // Maximum errors before entering error mode
    const errorCountThreshold = 10; // Threshold for showing user messages (increased)
    
    // State
    let errorCount = 0;
    let errorLog = [];
    let isErrorMode = false; // Disabled by default

    // ===== ERROR TYPES =====
    
    const ErrorTypes = {
        JAVASCRIPT: 'javascript',
        NETWORK: 'network',
        FORM: 'form',
        PERFORMANCE: 'performance',
        ACCESSIBILITY: 'accessibility',
        ANALYTICS: 'analytics'
    };

    // ===== GLOBAL ERROR HANDLING =====

    // Global error handler
    function initGlobalErrorHandling() {
        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            handleError(ErrorTypes.JAVASCRIPT, {
                message: event.error?.message || event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            handleError(ErrorTypes.JAVASCRIPT, {
                message: 'Unhandled promise rejection: ' + event.reason,
                reason: event.reason,
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Handle resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                handleError(ErrorTypes.NETWORK, {
                    message: 'Resource failed to load: ' + event.target.src || event.target.href,
                    resource: event.target.src || event.target.href,
                    tagName: event.target.tagName,
                    url: window.location.href
                });
            }
        }, true);
    }

    // Main error handler
    function handleError(type, errorData) {
        errorCount++;
        errorLog.push({
            type,
            timestamp: new Date().toISOString(),
            ...errorData
        });

        // Log error
        logError(type, errorData);

        // Report to analytics
        reportErrorToAnalytics(type, errorData);

        // Show user-friendly message if needed
        if (shouldShowUserMessage(type, errorData)) {
            showUserErrorMessage(type, errorData);
        }

        // Check if we should enter error mode
        // Disable error mode for production
        // if (errorCount >= maxErrors && !isErrorMode) {
        //     enterErrorMode();
        // }

        // Clean up old errors
        cleanupOldErrors();
    }

    // ===== ERROR LOGGING =====

    // Log error to console
    function logError(type, errorData) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
        
        console.group(prefix);
        console.error('Error Details:', errorData);
        console.error('Error Count:', errorCount);
        console.error('URL:', window.location.href);
        console.groupEnd();
    }

    // Report error to analytics
    function reportErrorToAnalytics(type, errorData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: `${type}: ${errorData.message}`,
                fatal: false,
                error_type: type,
                error_message: errorData.message,
                error_count: errorCount
            });
        }
    }

    // ===== USER-FRIENDLY ERROR MESSAGES =====

    // Determine if we should show a user message
    function shouldShowUserMessage(type, errorData) {
        // Don't show messages for minor errors
        if (errorCount > errorCountThreshold) return false;
        
        // Show messages for critical errors
        const criticalErrors = [
            'form submission failed',
            'payment processing failed',
            'critical resource failed to load'
        ];
        
        return criticalErrors.some(critical => 
            errorData.message.toLowerCase().includes(critical)
        );
    }

    // Show user-friendly error message
    function showUserErrorMessage(type, errorData) {
        const message = getUserFriendlyMessage(type, errorData);
        
        // Create error notification
        const notification = createErrorNotification(message, type);
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Get user-friendly error message
    function getUserFriendlyMessage(type, errorData) {
        const messages = {
            [ErrorTypes.FORM]: 'There was an issue with your form submission. Please try again.',
            [ErrorTypes.NETWORK]: 'Some content failed to load. Please refresh the page.',
            [ErrorTypes.PERFORMANCE]: 'The page is running slowly. Please wait a moment.',
            [ErrorTypes.ANALYTICS]: 'Analytics tracking is temporarily unavailable.',
            [ErrorTypes.JAVASCRIPT]: 'Something went wrong. Please refresh the page.',
            [ErrorTypes.ACCESSIBILITY]: 'Accessibility features are temporarily unavailable.'
        };

        return messages[type] || 'An unexpected error occurred. Please try again.';
    }

    // Create error notification element
    function createErrorNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `error-notification error-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        notification.innerHTML = `
            <div class="error-notification-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close" aria-label="Close error message">×</button>
            </div>
        `;

        // Add close functionality
        const closeButton = notification.querySelector('.error-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });

        // Add styles
        addErrorNotificationStyles();

        return notification;
    }

    // Add error notification styles
    function addErrorNotificationStyles() {
        if (document.getElementById('error-notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'error-notification-styles';
        styles.textContent = `
            .error-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc3545;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            }
            
            .error-notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .error-icon {
                font-size: 18px;
            }
            
            .error-message {
                flex: 1;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .error-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .error-close:hover {
                background-color: rgba(255,255,255,0.2);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // ===== ERROR MODE =====

    // Enter error mode when too many errors occur
    function enterErrorMode() {
        isErrorMode = true;
        
        // Disable non-critical features
        disableNonCriticalFeatures();
        
        // Show error mode notification
        showErrorModeNotification();
        
        // Log error mode entry
        console.warn('Entered error mode due to excessive errors');
        
        // Report to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'error_mode_entered', {
                error_count: errorCount,
                error_log: errorLog.slice(-10) // Last 10 errors
            });
        }
    }

    // Disable non-critical features
    function disableNonCriticalFeatures() {
        // Disable animations
        document.body.classList.add('error-mode');
        
        // Disable custom cursor
        const cursor = document.querySelector('.cursor-outline, .cursor-dot');
        if (cursor) cursor.style.display = 'none';
        
        // Disable complex interactions
        const interactiveElements = document.querySelectorAll('[data-interactive]');
        interactiveElements.forEach(el => {
            el.style.pointerEvents = 'none';
        });
    }

    // Show error mode notification
    function showErrorModeNotification() {
        const notification = document.createElement('div');
        notification.className = 'error-mode-notification';
        notification.innerHTML = `
            <div class="error-mode-content">
                <h3>⚠️ Performance Mode Enabled</h3>
                <p>Some features have been disabled to improve stability. Please refresh the page to restore full functionality.</p>
                <button onclick="location.reload()" class="refresh-button">Refresh Page</button>
            </div>
        `;

        // Add styles
        addErrorModeStyles();
        
        document.body.appendChild(notification);
    }

    // Add error mode styles
    function addErrorModeStyles() {
        if (document.getElementById('error-mode-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'error-mode-styles';
        styles.textContent = `
            .error-mode-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                border: 2px solid #dc3545;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 10001;
                max-width: 500px;
                text-align: center;
            }
            
            .error-mode-content h3 {
                color: #dc3545;
                margin: 0 0 15px 0;
                font-size: 18px;
            }
            
            .error-mode-content p {
                color: #666;
                margin: 0 0 20px 0;
                line-height: 1.5;
            }
            
            .refresh-button {
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            .refresh-button:hover {
                background: #c82333;
            }
            
            .error-mode * {
                animation: none !important;
                transition: none !important;
            }
        `;

        document.head.appendChild(styles);
    }

    // ===== FORM ERROR HANDLING =====

    // Handle form submission errors
    function handleFormError(formElement, errorData) {
        handleError(ErrorTypes.FORM, {
            message: 'Form submission failed',
            formId: formElement.id,
            formAction: formElement.action,
            ...errorData
        });

        // Show form-specific error message
        showFormErrorMessage(formElement, errorData);
    }

    // Show form-specific error message
    function showFormErrorMessage(formElement, errorData) {
        // Remove existing error messages
        const existingErrors = formElement.querySelectorAll('.form-error-message');
        existingErrors.forEach(error => error.remove());

        // Create error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        errorMessage.textContent = getUserFriendlyMessage(ErrorTypes.FORM, errorData);
        errorMessage.setAttribute('role', 'alert');

        // Insert at top of form
        formElement.insertBefore(errorMessage, formElement.firstChild);

        // Scroll to error
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ===== NETWORK ERROR HANDLING =====

    // Handle network errors
    function handleNetworkError(url, errorData) {
        handleError(ErrorTypes.NETWORK, {
            message: 'Network request failed',
            url: url,
            ...errorData
        });
    }

    // Retry failed network requests
    function retryNetworkRequest(url, options = {}, maxRetries = 3) {
        return new Promise((resolve, reject) => {
            let retryCount = 0;

            function attempt() {
                fetch(url, options)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        resolve(response);
                    })
                    .catch(error => {
                        retryCount++;
                        if (retryCount < maxRetries) {
                            // Exponential backoff
                            setTimeout(attempt, Math.pow(2, retryCount) * 1000);
                        } else {
                            handleNetworkError(url, { error: error.message, retryCount });
                            reject(error);
                        }
                    });
            }

            attempt();
        });
    }

    // ===== PERFORMANCE ERROR HANDLING =====

    // Handle performance issues
    function handlePerformanceIssue(metric, value, threshold) {
        handleError(ErrorTypes.PERFORMANCE, {
            message: `Performance threshold exceeded: ${metric}`,
            metric: metric,
            value: value,
            threshold: threshold
        });
    }

    // Monitor performance metrics
    function monitorPerformance() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            if (loadTime > 5000) { // 5 seconds threshold
                handlePerformanceIssue('page_load_time', loadTime, 5000);
            }
        });

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB threshold
                    handlePerformanceIssue('memory_usage', memory.usedJSHeapSize, 100 * 1024 * 1024);
                }
            }, 30000);
        }
    }

    // ===== ERROR RECOVERY =====

    // Attempt to recover from errors
    function attemptErrorRecovery(type, errorData) {
        switch (type) {
            case ErrorTypes.NETWORK:
                return retryNetworkRequest(errorData.url);
            case ErrorTypes.FORM:
                return retryFormSubmission(errorData.formElement);
            case ErrorTypes.PERFORMANCE:
                return optimizePerformance();
            default:
                return false;
        }
    }

    // Retry form submission
    function retryFormSubmission(formElement) {
        // This would implement form retry logic
        console.log('Attempting to retry form submission');
        return false;
    }

    // Optimize performance
    function optimizePerformance() {
        // Disable non-critical features
        document.body.classList.add('performance-mode');
        console.log('Performance optimization mode enabled');
        return true;
    }

    // ===== UTILITY FUNCTIONS =====

    // Clean up old errors
    function cleanupOldErrors() {
        const maxLogSize = 50;
        if (errorLog.length > maxLogSize) {
            errorLog = errorLog.slice(-maxLogSize);
        }
    }

    // Get error statistics
    function getErrorStats() {
        const stats = {
            totalErrors: errorCount,
            errorTypes: {},
            recentErrors: errorLog.slice(-10),
            isErrorMode: isErrorMode
        };

        errorLog.forEach(error => {
            stats.errorTypes[error.type] = (stats.errorTypes[error.type] || 0) + 1;
        });

        return stats;
    }

    // Reset error state
    function resetErrorState() {
        errorCount = 0;
        errorLog = [];
        isErrorMode = false;
        document.body.classList.remove('error-mode', 'performance-mode');
        
        // Remove error notifications
        const notifications = document.querySelectorAll('.error-notification, .error-mode-notification');
        notifications.forEach(notification => notification.remove());
    }

    // ===== INITIALIZATION =====

    // Initialize error handling
    function init() {
        // Initialize global error handling
        initGlobalErrorHandling();
        
        // Monitor performance
        monitorPerformance();
        
        // Add error recovery button to console
        if (window.console) {
            console.log('%cError Handling System Active', 'color: #28a745; font-weight: bold;');
            console.log('Use window.ErrorHandler.getErrorStats() to view error statistics');
            console.log('Use window.ErrorHandler.resetErrorState() to reset error state');
        }
        
        console.log('Error handling system initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for use in other scripts
    window.ErrorHandler = {
        handleError,
        handleFormError,
        handleNetworkError,
        retryNetworkRequest,
        getErrorStats,
        resetErrorState,
        attemptErrorRecovery,
        ErrorTypes
    };

})();