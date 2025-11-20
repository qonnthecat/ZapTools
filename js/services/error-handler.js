// js/services/error-handler.js
class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });

        // Handle global errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });
    }

    handleHistoryError(error, context = {}) {
        console.error('History Error:', error, context);
        
        // Log to analytics if available
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: `History Error: ${error.message}`,
                fatal: false
            });
        }
    }
}

export const errorHandler = new ErrorHandler();
export default errorHandler;