import React, { useMemo } from 'react';
import type { FinancialEvent, PortfolioPosition } from '../types';

interface UpcomingEventsProps {
  positions: PortfolioPosition[];
  manualEvents: FinancialEvent[];
}

// Reusing icons from CalendarView for consistency
const ResultsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const DividendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const CustomEventIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0M12 5v4m0 4h.01" />
    </svg>
);


const EventItem: React.FC<{ event: FinancialEvent, positionName?: string }> = ({ event, positionName }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.date + 'T00:00:00');
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let dateInfo;
    if (diffDays === 0) {
        dateInfo = <span className="text-sm font-bold text-amber-400 animate-pulse">Aujourd'hui</span>;
    } else if (diffDays === 1) {
        dateInfo = <span className="text-sm font-semibold text-cyan-400">Demain</span>;
    } else {
        dateInfo = <span className="text-sm font-semibold text-cyan-400">{`Dans ${diffDays} jours`}</span>
    }
    
    const ICONS = {
        earnings: <ResultsIcon />,
        dividend: <DividendIcon />,
        custom: <CustomEventIcon />,
    };

    return (
        <li className="flex items-center space-x-4">
            {ICONS[event.type]}
            <div className="flex-grow">
                <p className="font-semibold text-white">{event.title}</p>
                <p className="text-sm text-gray-400">
                    {positionName || 'Événement général'}
                </p>
            </div>
            <div className="text-right flex-shrink-0">
                {dateInfo}
                 <p className="text-xs text-gray-500">{eventDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</p>
            </div>
        </li>
    );
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ positions, manualEvents }) => {
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const autoEvents: FinancialEvent[] = [];
    positions.forEach(pos => {
      if (pos.nextEarningsDate) {
        autoEvents.push({
          id: `${pos.id}-earnings`,
          title: `Publication des résultats`,
          date: pos.nextEarningsDate,
          positionId: pos.id,
          type: 'earnings',
          source: 'auto'
        });
      }
      if (pos.nextDividendDate) {
        autoEvents.push({
          id: `${pos.id}-dividend`,
          title: `Versement des dividendes`,
          date: pos.nextDividendDate,
          positionId: pos.id,
          type: 'dividend',
          source: 'auto'
        });
      }
    });

    const allEvents = [...autoEvents, ...manualEvents];

    return allEvents
      .filter(event => new Date(event.date + 'T00:00:00').getTime() >= today.getTime())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [positions, manualEvents]);

  return (
    <div className="dashboard-card p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Prochaines Échéances</h3>
      {upcomingEvents.length > 0 ? (
        <ul className="space-y-4 flex-grow">
          {upcomingEvents.map(event => {
            const position = event.positionId ? positions.find(p => p.id === event.positionId) : null;
            return <EventItem key={event.id} event={event} positionName={position?.name} />;
          })}
        </ul>
      ) : (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-400">Aucune échéance à venir.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
