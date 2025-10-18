import React, { useEffect, useRef } from 'react';

interface ActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CloseIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const ActionPanel: React.FC<ActionPanelProps> = ({ isOpen, onClose, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only manage body scroll lock when panel is open.
    // The 'Escape' key listener has been removed.
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    // Cleanup overflow style.
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      className={`modal-wrapper ${isOpen ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-panel-title"
    >
      {/* The onClick handler has been removed to prevent closing on backdrop click. */}
      <div className="modal-backdrop" />
      <div ref={panelRef} className="modal-dialog dashboard-card flex flex-col">
        <div className="p-6 flex justify-between items-center border-b border-white/10 flex-shrink-0">
            <h2 id="action-panel-title" className="text-xl font-bold text-white">Ajouter une Position</h2>
            <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Fermer le panneau"
            >
                <CloseIcon />
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;