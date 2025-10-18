import React from 'react';

interface PortfolioSummaryProps {
  currentValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  lastUpdatedAt: number | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const StatCard: React.FC<{
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  valueClassName?: string;
}> = ({ title, value, change, isPositive, valueClassName }) => (
  <div className="dashboard-card p-5 h-full">
    <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">{title}</h3>
    <p className={`text-3xl font-bold mt-2 ${valueClassName || 'text-white'}`}>{value}</p>
    {change && (
      <p className={`text-sm font-semibold mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {change}
      </p>
    )}
  </div>
);

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ currentValue, totalCost, totalGainLoss, totalGainLossPercent, lastUpdatedAt }) => {
  const isPositive = totalGainLoss >= 0;
  const gainLossSign = isPositive ? '+' : '';

  const isOutdated = (timestamp: number | null): boolean => {
    if (!timestamp) return false;
    const oneDay = 24 * 60 * 60 * 1000;
    return (Date.now() - timestamp) > oneDay;
  };

  const formatUpdateDate = (timestamp: number | null): string => {
    if (!timestamp) {
        return "Mettez à jour une position pour commencer.";
    }
    return `Dernière mise à jour : ${new Date(timestamp).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <StatCard
          title="Valeur Totale"
          value={formatCurrency(currentValue)}
        />
        <p className={`text-xs mt-2 text-center ${isOutdated(lastUpdatedAt) ? 'text-amber-400 font-semibold' : 'text-gray-400'}`}>
          {formatUpdateDate(lastUpdatedAt)}
        </p>
      </div>
      
      <StatCard
        title="Coût d'Investissement"
        value={formatCurrency(totalCost)}
      />
      <StatCard
        title="Plus / Moins-value"
        value={`${gainLossSign}${formatCurrency(totalGainLoss)}`}
        change={`${gainLossSign}${totalGainLossPercent.toFixed(2)}%`}
        isPositive={isPositive}
        valueClassName={isPositive ? 'text-emerald-400' : 'text-red-400'}
      />
    </div>
  );
};

export default PortfolioSummary;