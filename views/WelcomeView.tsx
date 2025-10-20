import React from 'react';

interface WelcomeViewProps {
    userName: string;
    onComplete: () => void;
}

// --- Icons ---
const EyeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);

const BrainCircuitIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.59.67.5A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z"/>
    </svg>
);

const CompassIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>
    </svg>
);

const ArrowRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);


const WelcomeView: React.FC<WelcomeViewProps> = ({ userName, onComplete }) => {
    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
             <div 
                className="w-full max-w-4xl text-center dashboard-card p-8 md:p-12 animate-welcome-card-in"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.08), rgba(255,255,255,0.03))' }}
             >
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Bienvenue, {userName}.
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                        Votre portefeuille. Votre vision. Une clarté inégalée.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 my-12 text-left">
                    <div className="animate-fade-in-bounce" style={{ animationDelay: '0.5s' }}>
                        <div className="flex flex-col items-center text-center">
                            <EyeIcon />
                            <h3 className="text-xl font-semibold text-white mt-4">Clarté Visuelle</h3>
                            <p className="text-gray-400 mt-2">Des graphiques intuitifs pour comprendre votre portefeuille en un coup d'œil.</p>
                        </div>
                    </div>
                     <div className="animate-fade-in-bounce" style={{ animationDelay: '0.7s' }}>
                         <div className="flex flex-col items-center text-center">
                            <BrainCircuitIcon />
                            <h3 className="text-xl font-semibold text-white mt-4">Analyses IA</h3>
                            <p className="text-gray-400 mt-2">Obtenez des bilans stratégiques basés sur les dernières données du marché.</p>
                        </div>
                    </div>
                     <div className="animate-fade-in-bounce" style={{ animationDelay: '0.9s' }}>
                         <div className="flex flex-col items-center text-center">
                            <CompassIcon />
                            <h3 className="text-xl font-semibold text-white mt-4">Contrôle Total</h3>
                            <p className="text-gray-400 mt-2">Vos données sont sécurisées sur votre Drive et peuvent être exportées à tout moment.</p>
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                     <button
                        onClick={onComplete}
                        className="btn-glass btn-secondary text-base py-3 px-8 animate-subtle-pulse"
                    >
                        Découvrir mon Horizon
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeView;