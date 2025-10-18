import React from 'react';
import type { ViewMode } from '../App';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    showViewModeToggle: boolean;
    onSave: () => void;
    hasUnsavedChanges: boolean;
    isGoogleAuthAvailable: boolean;
}

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const DesktopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const MobileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, viewMode, setViewMode, showViewModeToggle, onSave, hasUnsavedChanges, isGoogleAuthAvailable }) => {
  return (
    <header className="bg-black/20 backdrop-blur-lg z-20 border-b border-white/10 sticky top-0">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
            <button
                onClick={onMenuClick}
                className="md:hidden mr-4 text-gray-300 hover:text-white"
                aria-label="Ouvrir le menu"
            >
                <MenuIcon />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {title}
            </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
            {showViewModeToggle && (
                <div className="flex items-center p-1 space-x-1 bg-black/20 rounded-lg" role="group">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'desktop' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        aria-pressed={viewMode === 'desktop'}
                        title="Affichage PC"
                    >
                        <DesktopIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'mobile' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        aria-pressed={viewMode === 'mobile'}
                        title="Affichage mobile"
                    >
                        <MobileIcon className="h-5 w-5" />
                    </button>
                </div>
            )}
             {isGoogleAuthAvailable && (
                <button
                    onClick={onSave}
                    disabled={!hasUnsavedChanges}
                    className={`btn-glass text-sm flex items-center !px-3 !py-1.5 transition-all duration-300 ${
                        hasUnsavedChanges 
                        ? 'btn-secondary animate-pulse-slow' 
                        : 'bg-white/5 border-white/10 opacity-70'
                    }`}
                    aria-label={hasUnsavedChanges ? "Enregistrer les modifications" : "Données enregistrées"}
                >
                    {hasUnsavedChanges ? <SaveIcon className="h-5 w-5" /> : <CheckIcon className="h-5 w-5 text-emerald-400" />}
                    <span className="ml-2 hidden sm:inline">{hasUnsavedChanges ? "Enregistrer" : "Enregistré"}</span>
                </button>
             )}
        </div>
      </div>
    </header>
  );
};

export default Header;