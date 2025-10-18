import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import type { ChartDataPoint } from '../types';

interface GainLossChartProps {
  data: ChartDataPoint[];
  onResetHistory: () => void;
  hasPendingChanges: boolean;
  onUpdateHistory: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const ResetIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 013.5 9" />
    </svg>
);

const UpdateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m-5 0l1.5 1.5A9 9 0 0119.95 15M20 20v-5h-5m5 0l-1.5-1.5A9 9 0 004.05 9" />
    </svg>
);


const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dashboard-card p-3">
        <p className="text-sm text-gray-300">{new Date(label).toLocaleString('fr-FR')}</p>
        <p className={`text-lg font-bold ${payload[0].value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {`Plus-value: ${formatCurrency(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};

const GainLossChart: React.FC<GainLossChartProps> = ({ data, onResetHistory, hasPendingChanges, onUpdateHistory }) => {
  if (data.length === 0) {
    return (
      <div className="dashboard-card p-8 text-center h-56 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-white">Historique des Performances</h3>
        <p className="text-gray-400 mt-2">Le graphique est prêt. Ajoutez vos positions, puis cliquez sur "Commencer le suivi" pour créer le premier point de données.</p>
         <button 
            onClick={onResetHistory}
            className="mt-4 mx-auto btn-glass btn-primary text-sm"
        >
            <ResetIcon />
            Commencer le suivi
        </button>
      </div>
    );
  }

  const lastGainLoss = data[data.length - 1]?.gainLoss ?? 0;
  const strokeColor = lastGainLoss >= 0 ? '#10B981' : '#EF4444'; // Emerald-500, Red-500
  const gradientId = lastGainLoss >= 0 ? 'gradient-positive' : 'gradient-negative';

  return (
    <div className="dashboard-card p-6 h-96 flex flex-col">
       {/* Header consolidé dans un conteneur flexbox réactif pour éviter la superposition */}
       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
            <h3 className="text-lg font-semibold text-white flex-shrink-0">Évolution de la Plus-value</h3>
            <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                {hasPendingChanges && (
                    <button
                        onClick={onUpdateHistory}
                        className="btn-glass btn-primary animate-pulse-slow !py-1.5 !px-3 text-xs"
                        title="Des modifications ont été apportées. Cliquez pour mettre à jour le graphique."
                    >
                        <UpdateIcon />
                        <span className="ml-2">Mettre à jour</span>
                    </button>
                )}
                <button 
                    onClick={onResetHistory}
                    className="flex items-center bg-white/10 hover:bg-white/20 text-gray-300 font-semibold py-1 px-3 rounded-full transition-colors text-xs"
                    title="Réinitialise l'historique et démarre le suivi à partir de l'état actuel du portefeuille."
                >
                    <ResetIcon />
                    <span className="ml-1">Réinitialiser</span>
                </button>
            </div>
       </div>
       {/* Conteneur de graphique qui remplit l'espace restant */}
       <div className="flex-grow w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: -5,
              }}
            >
              <defs>
                <linearGradient id="gradient-positive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradient-negative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatDate} 
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                stroke="#6B7280"
                tickFormatter={(value) => `€${value.toLocaleString('fr-FR', { notation: 'compact' })}`}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="3 3" strokeWidth={1.5}>
                <Label value="Seuil" fill="#9CA3AF" position="insideTopLeft" fontSize={10} />
              </ReferenceLine>
              
              <Area 
                type="monotone" 
                dataKey="gainLoss" 
                stroke={strokeColor}
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
};

export default GainLossChart;