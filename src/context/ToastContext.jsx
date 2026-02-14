/**
 * Toast Context
 * Global toast notification system
 */

import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: success, error, info, warning
     * @param {number} duration - Duration in ms (default 3000)
     */
    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();

        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    /**
     * Remove a specific toast
     */
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    /**
     * Clear all toasts
     */
    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    /**
     * Convenience methods
     */
    const success = useCallback((message, duration) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    const error = useCallback((message, duration) => {
        return showToast(message, 'error', duration);
    }, [showToast]);

    const info = useCallback((message, duration) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    const warning = useCallback((message, duration) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                removeToast,
                clearToasts,
                success,
                error,
                info,
                warning
            }}
        >
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

/**
 * Hook to use toast notifications
 */
export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }

    return context;
};

export default ToastContext;
