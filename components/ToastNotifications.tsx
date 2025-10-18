import React from 'react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const SuccessIcon: React.FC = () => (
  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ErrorIcon: React.FC = () => (
    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <div className="dashboard-card w-full max-w-sm p-4 flex items-center space-x-4 shadow-lg toast-enter">
      <div className="flex-shrink-0">
        {toast.type === 'success' && <SuccessIcon />}
        {toast.type === 'error' && <ErrorIcon />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{toast.message}</p>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-0 right-0 p-4 sm:p-6 space-y-4 w-full max-w-sm z-50">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;