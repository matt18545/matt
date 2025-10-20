import React, { useState, useCallback, useRef } from 'react';
import type { PortfolioPosition, PositionUpdatePayload, ToastMessage, ChartDataPoint, FinancialEvent } from '../types';
import PortfolioSummary from '../components/PortfolioSummary';
import AddPositionForm from '../components/AddPositionForm';
import PortfolioTable from '../components/PortfolioTable';
import GainLossChart from '../components/GainLossChart';
import ActionPanel from '../components/ActionPanel';
import AllocationChart from '../components/AllocationChart';
import AiBriefing from '../components/AiBriefing';
import UpcomingEvents from '../components/UpcomingEvents';
import type { ViewMode } from '../App';

interface DashboardViewProps {
    positions: PortfolioPosition[];
    setPositions: React.Dispatch<React.SetStateAction<PortfolioPosition[]>>;
    history: ChartDataPoint[];
    setHistory: React.Dispatch<React.SetStateAction<ChartDataPoint[]>>;
    manualEvents: FinancialEvent[]; // Ajout pour l'exportation
    setManualEvents: React.Dispatch<React.SetStateAction<FinancialEvent[]>>; // Ajout pour l'importation
    portfolioSummary: {
        totalCost: number;
        currentValue: number;
        totalGainLoss: number;
        totalGainLossPercent: number;
    };
    addToast: (message: string, type?: 'success' | 'error') => void;
    lastUpdatedAt: number | null;
    setLastUpdatedAt: React.Dispatch<React.SetStateAction<number | null>>;
    viewMode: ViewMode;
}

const ExportIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ImportIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const DashboardView: React.FC<DashboardViewProps> = ({
    positions,
    setPositions,
    history,
    setHistory,
    manualEvents,
    setManualEvents,
    portfolioSummary,
    addToast,
    lastUpdatedAt,
    setLastUpdatedAt,
    viewMode
}) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
    const [importedData, setImportedData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openPanel = useCallback(() => setIsPanelOpen(true), []);
    const closePanel = useCallback(() => setIsPanelOpen(false), []);

    const addPosition = useCallback((position: Omit<PortfolioPosition, 'id'>) => {
        const newPosition: PortfolioPosition = { ...position, id: crypto.randomUUID() };
        setPositions(prevPositions => [...prevPositions, newPosition]);
        setHasPendingChanges(true);
        setLastUpdatedAt(Date.now());
        addToast('Position ajoutée avec succès');
        closePanel();
    }, [addToast, closePanel, setPositions, setLastUpdatedAt]);

    const deletePosition = useCallback((id: string) => {
        setPositions(prevPositions => prevPositions.filter(p => p.id !== id));
        setHasPendingChanges(true);
        setLastUpdatedAt(Date.now());
        addToast('Position supprimée');
    }, [addToast, setPositions, setLastUpdatedAt]);

    const updatePosition = useCallback((id: string, updatedValues: PositionUpdatePayload) => {
        setPositions(prevPositions =>
            prevPositions.map(p =>
                p.id === id ? { ...p, ...updatedValues } : p
            )
        );
        setHasPendingChanges(true);
        setLastUpdatedAt(Date.now());
        addToast('Position mise à jour');
    }, [addToast, setPositions, setLastUpdatedAt]);
    
    const handleUpdateHistory = useCallback(() => {
        const newHistoryPoint: ChartDataPoint = { 
            timestamp: Date.now(), 
            gainLoss: portfolioSummary.totalGainLoss 
        };

        setHistory(prevHistory => {
            const lastPoint = prevHistory[prevHistory.length - 1];
            if (!lastPoint || lastPoint.gainLoss !== newHistoryPoint.gainLoss) {
                return [...prevHistory, newHistoryPoint];
            }
            return prevHistory;
        });
        setHasPendingChanges(true); // Now needs a save to sync with cloud
        addToast("Graphique mis à jour. Pensez à enregistrer.");
    }, [portfolioSummary.totalGainLoss, addToast, setHistory]);
    
    const handleResetHistory = useCallback(() => {
        const currentSnapshot: ChartDataPoint = {
            timestamp: Date.now(),
            gainLoss: portfolioSummary.totalGainLoss,
        };
        setHistory([currentSnapshot]);
        setHasPendingChanges(true); // The graph is now in sync but needs to be saved
        addToast("L'historique a été réinitialisé. Pensez à enregistrer.");
    }, [portfolioSummary.totalGainLoss, addToast, setHistory]);

    const handleExport = () => {
        try {
            const dataToExport = {
                positions: positions,
                history: history,
                manualEvents: manualEvents,
                lastUpdatedAt: lastUpdatedAt,
            };
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
            const link = document.createElement('a');
            link.href = jsonString;
            const date = new Date().toISOString().slice(0, 10);
            link.download = `portfolio-pro-backup-${date}.json`;
            link.click();
            addToast('Sauvegarde locale exportée avec succès !');
        } catch (error) {
            console.error("Erreur lors de l'exportation des données", error);
            addToast("Une erreur est survenue lors de l'exportation.", 'error');
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Le contenu du fichier n'est pas valide.");
                
                const data = JSON.parse(text);

                // Validation simple de la structure
                if (Array.isArray(data.positions) && Array.isArray(data.history) && Array.isArray(data.manualEvents) && ('lastUpdatedAt' in data)) {
                    setImportedData(data);
                    setIsImportConfirmOpen(true);
                } else {
                    throw new Error("La structure du fichier JSON est invalide.");
                }
            } catch (error) {
                console.error("Erreur lors de l'importation du fichier", error);
                addToast("Fichier d'importation invalide ou corrompu.", 'error');
            } finally {
                // Réinitialiser la valeur pour permettre la sélection du même fichier à nouveau
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };
    
    const handleConfirmImport = () => {
        if (!importedData) return;
        try {
            setPositions(importedData.positions);
            setHistory(importedData.history);
            setManualEvents(importedData.manualEvents);
            setLastUpdatedAt(importedData.lastUpdatedAt);
            // FIX: Removed call to undefined function `setHasUnsavedChanges`. The parent component now handles this logic via wrapped state setters.
            addToast('Données importées localement. Enregistrez pour synchroniser.');
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'état avec les données importées.", error);
            addToast("Une erreur s'est produite lors de l'application des données.", 'error');
        } finally {
            setIsImportConfirmOpen(false);
            setImportedData(null);
        }
    };

    const handleCancelImport = () => {
        setIsImportConfirmOpen(false);
        setImportedData(null);
    };

    return (
        <>
            <main className="container mx-auto px-4 md:px-6 py-8">
                <div className="space-y-8">
                    <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <PortfolioSummary {...portfolioSummary} lastUpdatedAt={lastUpdatedAt} />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                       <AiBriefing positions={positions} portfolioSummary={portfolioSummary} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <AllocationChart positions={positions} />
                        <UpcomingEvents positions={positions} manualEvents={manualEvents} />
                    </div>
                    
                     <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <GainLossChart
                            data={history}
                            onResetHistory={handleResetHistory}
                            hasPendingChanges={hasPendingChanges}
                            onUpdateHistory={handleUpdateHistory}
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                        <PortfolioTable 
                            positions={positions} 
                            onDeletePosition={deletePosition} 
                            onUpdatePosition={updatePosition}
                            onAddPositionClick={openPanel}
                            viewMode={viewMode}
                        />
                    </div>

                    {/* Section de Gestion des Données */}
                     <div className="dashboard-card p-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                        <h3 className="text-lg font-semibold text-white">Sauvegardes Locales</h3>
                        <p className="text-sm text-gray-400 mt-1 mb-4">
                           Créez une sauvegarde locale de vos données ou restaurez à partir d'un fichier. Ceci est indépendant de la synchronisation cloud avec votre compte Google.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleExport}
                                className="btn-glass btn-neutral w-full sm:w-auto"
                            >
                                <ExportIcon />
                                Exporter une copie
                            </button>
                            <label htmlFor="import-file" className="btn-glass btn-secondary w-full sm:w-auto cursor-pointer">
                                <ImportIcon />
                                Importer une copie
                            </label>
                            <input
                                id="import-file"
                                type="file"
                                accept=".json"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            </main>
            <ActionPanel isOpen={isPanelOpen} onClose={closePanel}>
                <AddPositionForm onAddPosition={addPosition} />
            </ActionPanel>

            {/* Modal de Confirmation d'Importation */}
            <div className={`modal-wrapper ${isImportConfirmOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
                <div className="modal-backdrop" onClick={handleCancelImport} />
                <div className="modal-dialog dashboard-card flex flex-col p-6">
                    <h2 className="text-xl font-bold text-white">Confirmer l'importation locale</h2>
                    <p className="text-gray-300 my-4">
                        Importer ce fichier écrasera vos données actuelles. Vous devrez ensuite cliquer sur "Enregistrer" pour synchroniser ces nouvelles données avec votre compte Google.
                    </p>
                    <div className="flex justify-end gap-4 mt-auto">
                        <button
                            onClick={handleCancelImport}
                            className="btn-glass btn-neutral"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirmImport}
                            className="btn-glass btn-danger"
                        >
                            Écraser et Importer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardView;