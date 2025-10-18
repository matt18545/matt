import React, { useMemo, useState } from 'react';
import type { FinancialEvent, PortfolioPosition } from '../types';

interface CalendarViewProps {
  positions: PortfolioPosition[];
  manualEvents: FinancialEvent[];
  setManualEvents: React.Dispatch<React.SetStateAction<FinancialEvent[]>>;
  addToast: (message: string, type?: 'success' | 'error') => void;
}

const ResultsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const DividendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const CustomEventIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0M12 5v4m0 4h.01" />
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const AddEventForm: React.FC<Omit<CalendarViewProps, 'manualEvents'>> = ({ positions, setManualEvents, addToast }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [positionId, setPositionId] = useState('');

    const resetForm = () => {
        setTitle('');
        setDate('');
        setDescription('');
        setPositionId('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date) {
            addToast("Le titre et la date sont requis.", 'error');
            return;
        }
        
        const newEvent: FinancialEvent = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date,
            description: description.trim() || undefined,
            positionId: positionId || undefined,
            source: 'manual',
            type: 'custom',
        };

        setManualEvents(prev => [...prev, newEvent]);
        addToast("Événement ajouté avec succès");
        resetForm();
    };
    
    return (
        <form onSubmit={handleSubmit} className="dashboard-card p-6 mt-4 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="event-title" className="block text-sm font-medium text-gray-300 mb-1">Titre de l'événement</label>
                    <input
                        id="event-title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Ex: Conférence des actionnaires"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div>
                    <label htmlFor="event-date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                        id="event-date"
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
             </div>

             <div>
                <label htmlFor="event-position" className="block text-sm font-medium text-gray-300 mb-1">Lier à une position (Optionnel)</label>
                <select 
                    id="event-position"
                    value={positionId}
                    onChange={e => setPositionId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="">Aucune</option>
                    {positions.map(pos => (
                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                    ))}
                </select>
             </div>

            <div>
                <label htmlFor="event-desc" className="block text-sm font-medium text-gray-300 mb-1">Description (Optionnel)</label>
                <textarea
                    id="event-desc"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Ajouter des détails..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
                ></textarea>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="btn-glass btn-primary">
                    Sauvegarder l'Événement
                </button>
            </div>
        </form>
    );
};

const CalendarView: React.FC<CalendarViewProps> = ({ positions, manualEvents, setManualEvents, addToast }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date for accurate comparison

  const allEvents = useMemo(() => {
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
    return [...autoEvents, ...manualEvents];
  }, [positions, manualEvents]);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const sortedEvents = [...allEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const upcoming: FinancialEvent[] = [];
    const past: FinancialEvent[] = [];

    sortedEvents.forEach(event => {
      const eventDate = new Date(event.date + 'T00:00:00');
      if (eventDate.getTime() >= today.getTime()) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });
    
    past.reverse(); // Show most recent past events first
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [allEvents, today]);

  const handleDeleteEvent = (id: string) => {
    setManualEvents(prev => prev.filter(event => event.id !== id));
    addToast("Événement supprimé");
  };

  const EventCard: React.FC<{ event: FinancialEvent, isPast?: boolean }> = ({ event, isPast = false }) => {
    const position = event.positionId ? positions.find(p => p.id === event.positionId) : null;
    const eventDate = new Date(event.date + 'T00:00:00');
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let dateInfo;
    if (isPast) {
        dateInfo = <span className="text-xs font-bold text-gray-400">PASSÉ</span>;
    } else if (diffDays === 0) {
        dateInfo = <span className="text-xs font-bold text-amber-400 animate-pulse">AUJOURD'HUI</span>;
    } else {
        dateInfo = <span className="text-xs font-bold text-cyan-400">{`DANS ${diffDays} JOURS`}</span>
    }

    return (
        <div className={`dashboard-card p-4 flex flex-col space-y-3 transition-opacity relative ${isPast ? 'opacity-60 hover:opacity-100' : ''}`}>
            {event.source === 'manual' && (
                <button 
                    onClick={() => handleDeleteEvent(event.id)} 
                    className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                    aria-label="Supprimer l'événement"
                >
                    <TrashIcon />
                </button>
            )}
            <div className="flex justify-between items-baseline">
                <div className="flex items-center space-x-3">
                    {event.type === 'earnings' && <ResultsIcon />}
                    {event.type === 'dividend' && <DividendIcon />}
                    {event.type === 'custom' && <CustomEventIcon />}
                    <span className="font-semibold text-lg text-white pr-8">{event.title}</span>
                </div>
                {dateInfo}
            </div>
           
            <p className="text-sm text-gray-400 pl-8">
                {new Date(event.date).toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
            </p>

            {event.description && <p className="text-sm text-gray-300 italic pl-8">"{event.description}"</p>}

            {position && (
              <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                  <img src={position.iconUrl} alt={position.name} className="h-5 w-5 rounded-full bg-white p-0.5" />
                  <span className="text-sm text-gray-200 font-medium">{position.name}</span>
              </div>
            )}
        </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Calendrier des Événements</h1>
        <p className="mt-2 text-lg text-gray-300">Suivez les dates clés, automatiques ou manuelles, pour vos positions.</p>
      </header>

      <div className="mb-8">
          <button
              onClick={() => setIsFormVisible(v => !v)}
              className="btn-glass btn-secondary w-full md:w-auto"
          >
              {isFormVisible ? 'Annuler' : 'Ajouter un Événement Manuel'}
          </button>
          {isFormVisible && <AddEventForm positions={positions} setManualEvents={setManualEvents} addToast={addToast} />}
      </div>

      <div className="space-y-10">
         <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b-2 border-cyan-500">Événements à Venir</h2>
              {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                  </div>
              ) : (
                  <div className="dashboard-card p-8 text-center">
                    <p className="text-gray-400">Aucun événement à venir.</p>
                  </div>
              )}
         </section>

         <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b-2 border-white/10">Événements Passés</h2>
              {pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {pastEvents.map(event => <EventCard key={event.id} event={event} isPast />)}
                  </div>
              ) : (
                  <div className="dashboard-card p-8 text-center">
                    <p className="text-gray-400">Aucun événement n'est encore passé.</p>
                  </div>
              )}
         </section>
      </div>
    </div>
  );
};

export default CalendarView;