import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PortfolioPosition } from '../types';

interface AllocationChartProps {
  positions: PortfolioPosition[];
}

const COLORS = [
  '#10b981', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899',
  '#f59e0b', '#14b8a6', '#6366f1', '#d946ef', '#0ea5e9',
  '#ef4444', '#6b7280', '#22c55e', '#a855f7', '#eab308'
];


// Helper to calculate label position
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null; // Don't render label for small slices
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="dashboard-card p-3">
          <p className="font-bold">{`${data.name}`}</p>
          <p className="text-sm text-gray-300">{`Valeur: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.value)}`}</p>
          <p className="text-sm text-gray-300">{`Pourcentage: ${(data.payload.percent * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
  
    return null;
};

type GroupBy = 'position' | 'sector' | 'geo';

const AllocationChart: React.FC<AllocationChartProps> = ({ positions }) => {
  const [groupBy, setGroupBy] = useState<GroupBy>('position');

  const totalValue = useMemo(() => positions.reduce((acc, pos) => acc + pos.currentValue, 0), [positions]);

  const chartData = useMemo(() => {
    if (positions.length === 0) return [];
    
    let groupedData: { [key: string]: number } = {};

    if (groupBy === 'position') {
        return positions
            .map(position => ({
                name: position.name,
                value: position.currentValue,
            }))
            .sort((a, b) => b.value - a.value);
    }
    
    if (groupBy === 'sector') {
        groupedData = positions.reduce((acc, position) => {
          const key = position.sector || 'Non Catégorisé';
          acc[key] = (acc[key] || 0) + position.currentValue;
          return acc;
        }, {} as { [key: string]: number });
    } else if (groupBy === 'geo') {
        groupedData = positions.reduce((acc, position) => {
          const key = position.geo || 'Non Catégorisé';
          acc[key] = (acc[key] || 0) + position.currentValue;
          return acc;
        }, {} as { [key: string]: number });
    }
    
    return Object.entries(groupedData)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value); // Sort for consistent color mapping
  }, [positions, groupBy]);

  const ToggleButton: React.FC<{ label: string; value: GroupBy; }> = ({ label, value }) => (
    <button
        onClick={() => setGroupBy(value)}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            groupBy === value
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
    >
        {label}
    </button>
  );

  return (
    <div className="dashboard-card p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-white">Répartition des Actifs</h3>
        <div className="flex items-center space-x-2 p-1 bg-black/20 rounded-lg self-start sm:self-center">
           <ToggleButton label="Par Action" value="position" />
           <ToggleButton label="Par Secteur" value="sector" />
           <ToggleButton label="Par Géographie" value="geo" />
        </div>
      </div>
      {positions.length === 0 || totalValue === 0 ? (
        <div className="h-72 flex items-center justify-center">
            <p className="text-gray-400">Ajoutez des positions pour voir leur répartition ici.</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--glass-bg)" strokeWidth={3}/>
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipContent />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px', bottom: -10 }}
                formatter={(value, entry, index) => <span className="text-gray-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AllocationChart;