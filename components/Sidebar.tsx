import React from 'react';
import type { View } from '../App';
import type { UserProfile } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isDesktopSidebarCollapsed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isMobileNavOpen: boolean;
  userProfile: UserProfile | null;
  onSignOut: () => void;
}

const ChartBarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const NewspaperIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6M7 8h6" />
    </svg>
);

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const LogoutIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isDesktopSidebarCollapsed, onMouseEnter, onMouseLeave, isMobileNavOpen, userProfile, onSignOut }) => {
    
    const LinkText: React.FC<{children: React.ReactNode}> = ({ children }) => (
        <span className={`whitespace-nowrap md:transition-all md:duration-200 ${isDesktopSidebarCollapsed ? 'md:w-0 md:opacity-0 md:ml-0' : 'ml-3'}`}>
            {children}
        </span>
    );
    
    return (
        <nav 
            className={`sidebar ${isDesktopSidebarCollapsed ? 'collapsed' : 'expanded'} ${isMobileNavOpen ? 'open' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={`mb-10 whitespace-nowrap overflow-hidden md:transition-all md:duration-200 ${isDesktopSidebarCollapsed ? 'md:h-0 md:opacity-0 md:mb-0' : ''}`}>
                <h1 className="text-2xl font-bold text-white text-center tracking-tight">
                    Horizon Invest
                </h1>
            </div>
            <ul className="space-y-2 flex-grow">
                <li>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActiveView('dashboard'); }}
                        className={`sidebar-link ${activeView === 'dashboard' ? 'active' : ''}`}
                        title="Tableau de Bord"
                    >
                        <ChartBarIcon />
                        <LinkText>Tableau de Bord</LinkText>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActiveView('insights'); }}
                        className={`sidebar-link ${activeView === 'insights' ? 'active' : ''}`}
                        title="Actualités Financières"
                    >
                       <NewspaperIcon />
                       <LinkText>Actualités Financières</LinkText>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActiveView('calendar'); }}
                        className={`sidebar-link ${activeView === 'calendar' ? 'active' : ''}`}
                        title="Calendrier des Événements"
                    >
                       <CalendarIcon />
                       <LinkText>Calendrier</LinkText>
                    </a>
                </li>
            </ul>

            <div className="pt-4 border-t border-white/10">
                {userProfile && (
                     <>
                        <div className={`p-2 mb-2 overflow-hidden ${isDesktopSidebarCollapsed ? 'md:h-12' : ''}`}>
                            <div className="flex items-center">
                                <img src={userProfile.picture} alt="User avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                                <div className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${isDesktopSidebarCollapsed ? 'md:w-0 md:opacity-0 md:ml-0' : 'ml-3'}`}>
                                    <p className="text-sm font-semibold text-white truncate">{userProfile.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{userProfile.email}</p>
                                </div>
                            </div>
                        </div>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onSignOut(); }}
                            className="sidebar-link"
                            title="Déconnexion"
                        >
                            <LogoutIcon />
                            <LinkText>Déconnexion</LinkText>
                        </a>
                     </>
                )}
            </div>
        </nav>
    );
};

export default Sidebar;