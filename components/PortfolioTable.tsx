import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { PortfolioPosition, PositionUpdatePayload } from '../types';
import type { ViewMode } from '../App';

interface PortfolioTableProps {
  positions: PortfolioPosition[];
  onDeletePosition: (id: string) => void;
  onUpdatePosition: (id: string, updatedValues: PositionUpdatePayload) => void;
  onAddPositionClick: () => void;
  viewMode: ViewMode;
}

type SortKey = 'name' | 'totalCost' | 'currentValue' | 'gainLoss' | 'gainLossPercent' | null;
type SortDirection = 'ascending' | 'descending';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => (
    <span className="ml-2 text-gray-400 text-xs">
        {direction === 'ascending' ? '▲' : '▼'}
    </span>
);

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute top-1/2 right-2 -translate-y-1/2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const EditableCell: React.FC<{ value: number, onSave: (newValue: number) => void }> = ({ value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleStartEditing = () => {
        setInputValue(value.toString());
        setIsEditing(true);
    };

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        const newValue = parseFloat(inputValue);
        if (!isNaN(newValue) && newValue >= 0) {
            onSave(newValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full bg-black/30 border border-cyan-500 rounded-md px-2 py-1 text-right text-white focus:ring-1 focus:ring-cyan-400 font-mono-nums"
                min="0"
                step="0.01"
            />
        );
    }

    return (
        <div onClick={handleStartEditing} className="font-mono-nums cursor-pointer px-2 py-1 rounded-md hover:bg-cyan-500/10 transition-colors group relative">
            {formatCurrency(value)}
            <EditIcon />
        </div>
    );
};

const PositionCard: React.FC<{ position: PortfolioPosition, onDeletePosition: (id: string) => void, onUpdatePosition: (id: string, updatedValues: PositionUpdatePayload) => void }> = ({ position, onDeletePosition, onUpdatePosition }) => {
    const gainLoss = position.currentValue - position.totalCost;
    const gainLossPercent = position.totalCost !== 0 ? (gainLoss / position.totalCost) * 100 : 0;
    const isPositive = gainLoss >= 0;

    return (
        <div className={`dashboard-card p-4 space-y-3 border-l-4 ${isPositive ? 'border-emerald-500' : 'border-red-500'}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <img src={position.iconUrl} alt={`${position.name} logo`} className="h-10 w-10 rounded-full object-cover shadow-md bg-white p-0.5" />
                    <div>
                        <h4 className="font-bold text-white text-base">{position.name}</h4>
                        <p className="text-xs text-gray-400">{position.sector}</p>
                    </div>
                </div>
                <button
                    onClick={() => onDeletePosition(position.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 -mt-1 -mr-1"
                    aria-label={`Supprimer ${position.name}`}
                >
                    <TrashIcon className="h-5 w-5"/>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-gray-400">Valeur Actuelle</div>
                <div className="text-right text-white">
                    <EditableCell value={position.currentValue} onSave={(newValue) => onUpdatePosition(position.id, { currentValue: newValue })} />
                </div>

                <div className="text-gray-400">Coût Total</div>
                <div className="text-right text-gray-300">
                     <EditableCell value={position.totalCost} onSave={(newValue) => onUpdatePosition(position.id, { totalCost: newValue })} />
                </div>
            </div>

            <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-300">Plus-value totale</span>
                    <span className={`font-semibold font-mono-nums ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}% ({formatCurrency(gainLoss)})
                    </span>
                </div>
            </div>
        </div>
    );
};

// Memoization du composant de ligne pour éviter les rendus inutiles
const PortfolioTableRow: React.FC<{ position: PortfolioPosition, onDeletePosition: (id: string) => void, onUpdatePosition: (id: string, updatedValues: PositionUpdatePayload) => void }> = React.memo(({ position, onDeletePosition, onUpdatePosition }) => {
    const gainLoss = position.currentValue - position.totalCost;
    const gainLossPercent = position.totalCost !== 0 ? (gainLoss / position.totalCost) * 100 : 0;
    const isPositive = gainLoss >= 0;

    return (
        <tr className={`border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors duration-150 border-l-4 ${isPositive ? 'border-emerald-500' : 'border-red-500'}`}>
            <td className="pl-6 pr-4 py-4">
                <img src={position.iconUrl} alt={`${position.name} logo`} className="h-10 w-10 rounded-full object-cover shadow-md bg-white p-0.5" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{position.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                <EditableCell value={position.totalCost} onSave={(newValue) => onUpdatePosition(position.id, { totalCost: newValue })} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                <EditableCell value={position.currentValue} onSave={(newValue) => onUpdatePosition(position.id, { currentValue: newValue })} />
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right font-mono-nums ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{formatCurrency(gainLoss)}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right font-mono-nums ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                 <button
                    onClick={() => onDeletePosition(position.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    aria-label={`Supprimer ${position.name}`}
                >
                    <TrashIcon className="h-5 w-5"/>
                </button>
            </td>
        </tr>
    );
});


const INITIAL_LOAD_COUNT = 20;
const LOAD_MORE_COUNT = 20;

const PortfolioTable: React.FC<PortfolioTableProps> = ({ positions, onDeletePosition, onUpdatePosition, onAddPositionClick, viewMode }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const [sortKey, setSortKey] = useState<SortKey>('currentValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('descending');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
        setSortDirection(prev => prev === 'ascending' ? 'descending' : 'ascending');
    } else {
        setSortKey(key);
        setSortDirection('ascending');
    }
    setVisibleCount(INITIAL_LOAD_COUNT); // Reset pagination on sort
  };

  const sortedPositions = useMemo(() => {
    if (!sortKey) return positions;

    const sorted = [...positions].sort((a, b) => {
        if (sortKey === 'name') {
            const comparison = a.name.localeCompare(b.name);
            return sortDirection === 'ascending' ? comparison : -comparison;
        }
        
        let valA, valB;
        if (sortKey === 'gainLoss') {
            valA = a.currentValue - a.totalCost;
            valB = b.currentValue - b.totalCost;
        } else if (sortKey === 'gainLossPercent') {
            valA = a.totalCost !== 0 ? ((a.currentValue - a.totalCost) / a.totalCost) * 100 : 0;
            valB = b.totalCost !== 0 ? ((b.currentValue - b.totalCost) / b.totalCost) * 100 : 0;
        } else { // 'totalCost' or 'currentValue'
            valA = a[sortKey];
            valB = b[sortKey];
        }

        const comparison = (valA as number) - (valB as number);
        return sortDirection === 'ascending' ? comparison : -comparison;
    });
    
    // The direction is now handled inside the sort function, no need to reverse.
    return sorted;

  }, [positions, sortKey, sortDirection]);

  const visiblePositions = useMemo(() => sortedPositions.slice(0, visibleCount), [sortedPositions, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + LOAD_MORE_COUNT, positions.length));
  };
  
  const SortableHeader: React.FC<{ columnKey: SortKey; label: string; className?: string }> = ({ columnKey, label, className }) => (
    <th
      scope="col"
      className={`px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors ${className}`}
      onClick={() => handleSort(columnKey)}
      aria-sort={sortKey === columnKey ? sortDirection : 'none'}
    >
      <div className={`flex items-center ${className?.includes('text-right') ? 'justify-end' : ''}`}>
        {label}
        {sortKey === columnKey && <SortIcon direction={sortDirection} />}
      </div>
    </th>
  );

  return (
    <div className="dashboard-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Détail des Positions ({positions.length})</h3>
           <button
            onClick={onAddPositionClick}
            className="btn-glass btn-primary text-sm"
          >
            <PlusIcon />
            Ajouter une Position
          </button>
        </div>

        {positions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">Votre portefeuille est vide. Ajoutez une position pour la voir apparaître ici.</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            {viewMode === 'mobile' && (
              <div className="p-4 space-y-4">
                  {visiblePositions.map(position => (
                      <PositionCard 
                          key={position.id} 
                          position={position} 
                          onDeletePosition={onDeletePosition} 
                          onUpdatePosition={onUpdatePosition} 
                      />
                  ))}
              </div>
            )}

            {/* Desktop View: Table */}
            {viewMode === 'desktop' && (
              <div className="overflow-x-auto">
                  <table className="min-w-full">
                      <thead className="bg-white/5">
                          <tr>
                              <th scope="col" className="pl-6 pr-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Icône</th>
                              <SortableHeader columnKey="name" label="Nom" className="text-left" />
                              <SortableHeader columnKey="totalCost" label="Coût Total" className="text-right" />
                              <SortableHeader columnKey="currentValue" label="Valeur Actuelle" className="text-right" />
                              <SortableHeader columnKey="gainLoss" label="Plus-value (€)" className="text-right" />
                              <SortableHeader columnKey="gainLossPercent" label="Plus-value (%)" className="text-right" />
                              <th scope="col" className="relative px-6 py-3">
                                  <span className="sr-only">Actions</span>
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          {visiblePositions.map(position => (
                              <PortfolioTableRow key={position.id} position={position} onDeletePosition={onDeletePosition} onUpdatePosition={onUpdatePosition} />
                          ))}
                      </tbody>
                  </table>
              </div>
            )}

            {visibleCount < positions.length && (
              <div className="bg-black/20 px-6 py-4 text-center">
                <button
                  onClick={handleLoadMore}
                  className="btn-glass btn-primary py-2 px-5"
                >
                  Charger plus ({positions.length - visibleCount} restantes)
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
};

export default PortfolioTable;
