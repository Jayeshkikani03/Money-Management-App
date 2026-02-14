/**
 * Toast Notification Component
 * Displays temporary notification messages
 */

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle
    };

    const Icon = icons[type] || Info;

    return (
        <div className={`toast toast-${type}`} role="alert">
            <div className="toast-icon">
                <Icon size={20} />
            </div>
            <div className="toast-message">{message}</div>
            <button
                className="toast-close"
                onClick={onClose}
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
