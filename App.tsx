import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { PortfolioPosition, ToastMessage, ChartDataPoint, FinancialEvent, UserProfile } from './types';
import ToastContainer from './components/ToastNotifications';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import InsightsView from './views/InsightsView';
import CalendarView from './views/CalendarView';
import Header from './components/Header';
import LoginView from './views/LoginView';
import WelcomeView from './views/WelcomeView';
import TutorialModal from './components/TutorialModal';

// FIX: Add declarations for Google API objects to resolve TypeScript errors by extending the Window interface.
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export type View = 'dashboard' | 'insights' | 'calendar';
export type ViewMode = 'desktop' | 'mobile';

// --- Google API Configuration ---
// Note: GOOGLE_CLIENT_ID and API_KEY must be set in your environment variables.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const API_KEY = process.env.API_KEY || '';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile';
const APP_DATA_FILE_NAME = 'horizon-invest-data.json';

const App: React.FC = () => {
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [history, setHistory] = useState<ChartDataPoint[]>([]);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [manualEvents, setManualEvents] = useState<FinancialEvent[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const dataFileIdRef = useRef<string | null>(null);

  // --- Authentication State ---
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [isGoogleAuthAvailable, setIsGoogleAuthAvailable] = useState(false);
  
  // --- Onboarding State ---
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    // This effect runs only once on mount to check if the tutorial should be shown.
    const shouldShowTutorial = localStorage.getItem('horizon-invest-show-tutorial');
    if (shouldShowTutorial !== 'false') {
      setIsTutorialOpen(true);
    }
  }, []);

  const handleCloseTutorial = (dontShowAgain: boolean) => {
    setIsTutorialOpen(false);
    if (dontShowAgain) {
      localStorage.setItem('horizon-invest-show-tutorial', 'false');
    }
  };


  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  const loadDataFromDrive = useCallback(async () => {
    try {
      // 1. Find the file in the appDataFolder
      const searchResponse = await window.gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        fields: 'files(id, name)',
        q: `name='${APP_DATA_FILE_NAME}'`
      });

      let fileId = searchResponse.result.files?.[0]?.id;

      // 2. If the file doesn't exist, create it with default data
      if (!fileId) {
        const createResponse = await window.gapi.client.drive.files.create({
          resource: {
            name: APP_DATA_FILE_NAME,
            parents: ['appDataFolder']
          },
          fields: 'id'
        });
        fileId = createResponse.result.id;
        if (fileId) {
            dataFileIdRef.current = fileId;
            // First time user, no data to load. Save initial empty state.
            await handleSaveData(true); // Save silently
        }
      } else {
        dataFileIdRef.current = fileId;
        // 3. If the file exists, read its content
        const fileGetResponse = await window.gapi.client.drive.files.get({
          fileId: fileId,
          alt: 'media'
        });
        const data = JSON.parse(fileGetResponse.body);
        setPositions(data.positions || []);
        setHistory(data.history || []);
        setManualEvents(data.manualEvents || []);
        setLastUpdatedAt(data.lastUpdatedAt || null);
      }
      addToast('Données synchronisées depuis Google Drive.');
    } catch (error: any) {
        console.error("Erreur lors du chargement des données depuis Google Drive", error);
        addToast(error.result?.error?.message || "Erreur de chargement des données.", 'error');
    }
  }, [addToast]);

  const handleAuthSuccess = useCallback(async (tokenResponse: any) => {
    // Save token to use with gapi for Drive API calls
    window.gapi.client.setToken(tokenResponse);
    setIsLoggedIn(true);

    try {
        // Fetch user profile using the modern fetch API, which is more reliable
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
            }
        });
        
        if (!profileResponse.ok) {
            const errorResult = await profileResponse.json();
            throw new Error(errorResult.error_description || 'Échec de la récupération du profil utilisateur.');
        }

        const userProfileData = await profileResponse.json();

        setUserProfile({
            name: userProfileData.name || 'Utilisateur',
            email: userProfileData.email || '',
            picture: userProfileData.picture || '',
        });
        
        // Load user data from drive
        await loadDataFromDrive();
    } catch (error: any) {
        console.error("Erreur de récupération du profil", error);
        addToast(error.message || "Erreur de récupération du profil.", 'error');
    }
  }, [loadDataFromDrive, addToast]);


  useEffect(() => {
    const initializeGis = () => {
        if (!GOOGLE_CLIENT_ID || !API_KEY) {
            console.warn("Configuration Google manquante. L'application fonctionnera en mode local uniquement.");
            setIsGoogleAuthAvailable(false);
            setIsInitializing(false);
            return;
        }
        
        setIsGoogleAuthAvailable(true);

        if (window.google && window.gapi) {
            // Initialize gapi client for Drive API
            window.gapi.load('client', async () => {
                await window.gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: DISCOVERY_DOCS,
                });
            });

            // Initialize Google Identity Services token client
            try {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: SCOPES,
                    callback: (tokenResponse: any) => {
                        if (tokenResponse.error) {
                            console.error('Token client error:', tokenResponse.error);
                            addToast(`Erreur d'authentification : ${tokenResponse.error_description || tokenResponse.error}`, 'error');
                            setIsInitializing(false);
                        } else {
                            handleAuthSuccess(tokenResponse);
                        }
                    },
                });
                setTokenClient(client);
            } catch (error) {
                console.error("Erreur lors de l'initialisation du client Google Identity. Vérifiez la configuration.", error);
                 addToast("Erreur d'initialisation du service d'authentification.", 'error');
            } finally {
                setIsInitializing(false);
            }
        } else {
            // Retry if scripts are not loaded yet
            setTimeout(initializeGis, 100);
        }
    };
    initializeGis();
  }, [handleAuthSuccess, addToast]);


  const handleLogin = useCallback(() => {
    if (tokenClient) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        addToast("Le service d'authentification n'est pas prêt.", 'error');
    }
  }, [tokenClient, addToast]);

  const handleLogout = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
            window.gapi.client.setToken(null);
            setIsLoggedIn(false);
            setUserProfile(null);
            setHasSeenWelcome(false); // Reset welcome screen for next login
            // Reset all data
            setPositions([]);
            setHistory([]);
            setManualEvents([]);
            setLastUpdatedAt(null);
            setHasUnsavedChanges(false);
            dataFileIdRef.current = null;
            addToast("Vous avez été déconnecté.");
        });
    }
  }, [addToast]);

  useEffect(() => {
    // Set the initial view mode based on screen width, but only once.
    if (window.innerWidth < 768) {
      setViewMode('mobile');
    }
  }, []);

  // Spotlight effect that follows the mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Parallax effect for the background
  useEffect(() => {
    const mainEl = mainContentRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      const scrollTop = mainEl.scrollTop;
      const scrollFactor = 0.3; // Adjust for more/less parallax
      document.documentElement.style.setProperty('--bg-scroll-y', `${-scrollTop * scrollFactor}px`);
    };

    mainEl.addEventListener('scroll', handleScroll);

    return () => {
      mainEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const portfolioSummary = useMemo(() => {
    const totalCost = positions.reduce((acc, pos) => acc + pos.totalCost, 0);
    const currentValue = positions.reduce((acc, pos) => acc + pos.currentValue, 0);
    const totalGainLoss = currentValue - totalCost;
    const totalGainLossPercent = totalCost !== 0 ? (totalGainLoss / totalCost) * 100 : 0;

    return {
      totalCost,
      currentValue,
      totalGainLoss,
      totalGainLossPercent
    };
  }, [positions]);

  const handleSaveData = useCallback(async (silent = false) => {
    if (!isGoogleAuthAvailable || !isLoggedIn) {
        if (!silent) addToast("La synchronisation cloud est désactivée.", 'error');
        return;
    }

    if (!dataFileIdRef.current) {
        if (!silent) addToast("Aucun fichier de données trouvé pour la sauvegarde.", 'error');
        return;
    }

    const dataToSave = {
        positions,
        history,
        manualEvents,
        lastUpdatedAt,
    };
    const blob = new Blob([JSON.stringify(dataToSave)], { type: 'application/json' });

    try {
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify({ mimeType: 'application/json' })], { type: 'application/json' }));
        formData.append('file', blob);

        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${dataFileIdRef.current}?uploadType=multipart`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${window.gapi.client.getToken().access_token}`,
            },
            body: formData,
        });

        setHasUnsavedChanges(false);
        if (!silent) addToast('Données synchronisées avec succès !');
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des données sur Google Drive", error);
        if (!silent) addToast("Erreur de synchronisation des données.", 'error');
    }
  }, [positions, history, lastUpdatedAt, manualEvents, addToast, isGoogleAuthAvailable, isLoggedIn]);

  const setPositionsWithSaveCheck = useCallback((updater: React.SetStateAction<PortfolioPosition[]>) => {
    setPositions(updater);
    setHasUnsavedChanges(true);
  }, []);

  const setHistoryWithSaveCheck = useCallback((updater: React.SetStateAction<ChartDataPoint[]>) => {
    setHistory(updater);
    setHasUnsavedChanges(true);
  }, []);
  
  const setManualEventsWithSaveCheck = useCallback((updater: React.SetStateAction<FinancialEvent[]>) => {
    setManualEvents(updater);
    setHasUnsavedChanges(true);
  }, []);

  const setLastUpdatedAtWithSaveCheck = useCallback((updater: React.SetStateAction<number | null>) => {
    setLastUpdatedAt(updater);
    setHasUnsavedChanges(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const viewTitles: { [key in View]: string } = {
    dashboard: 'Tableau de Bord',
    insights: 'Actualités Financières',
    calendar: 'Calendrier des Événements',
  };
  
  if (isInitializing) {
    return (
        <div className="w-full h-screen flex items-center justify-center text-white">
            <svg className="animate-spin h-8 w-8 text-cyan-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Initialisation...
        </div>
    );
  }

  if (isGoogleAuthAvailable && !isLoggedIn) {
      return <LoginView onLogin={handleLogin} />;
  }

  if (isGoogleAuthAvailable && !hasSeenWelcome) {
    return (
      <WelcomeView
        userName={userProfile?.name?.split(' ')[0] || 'Investisseur'}
        onComplete={() => setHasSeenWelcome(true)}
      />
    );
  }


  return (
    <div className="text-gray-100 font-sans min-h-screen flex w-full">
       {isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <Sidebar 
        activeView={activeView} 
        setActiveView={(view: View) => {
          setActiveView(view);
          setIsMobileNavOpen(false); // Close mobile nav on selection
        }} 
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        onMouseEnter={() => setIsDesktopSidebarCollapsed(false)}
        onMouseLeave={() => setIsDesktopSidebarCollapsed(true)}
        isMobileNavOpen={isMobileNavOpen}
        userProfile={userProfile}
        onSignOut={handleLogout}
      />
      
      <div className="main-content">
        <Header 
          title={viewTitles[activeView]}
          onMenuClick={() => setIsMobileNavOpen(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showViewModeToggle={activeView === 'dashboard'}
          onSave={() => handleSaveData(false)}
          hasUnsavedChanges={hasUnsavedChanges}
          isGoogleAuthAvailable={isGoogleAuthAvailable}
        />
        <div ref={mainContentRef} className="flex-1 overflow-y-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              positions={positions}
              setPositions={setPositionsWithSaveCheck}
              history={history}
              setHistory={setHistoryWithSaveCheck}
              manualEvents={manualEvents}
              setManualEvents={setManualEventsWithSaveCheck}
              portfolioSummary={portfolioSummary}
              addToast={addToast}
              lastUpdatedAt={lastUpdatedAt}
              setLastUpdatedAt={setLastUpdatedAtWithSaveCheck}
              viewMode={viewMode}
            />
          )}
          {activeView === 'insights' && (
            <InsightsView />
          )}
          {activeView === 'calendar' && (
            <CalendarView
              positions={positions}
              manualEvents={manualEvents}
              setManualEvents={setManualEventsWithSaveCheck}
              addToast={addToast}
            />
          )}
        </div>
      </div>
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <TutorialModal isOpen={isTutorialOpen} onClose={handleCloseTutorial} />
    </div>
  );
};

export default App;