import React, { useState } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain: boolean) => void;
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

// --- Icônes pour les maquettes ---
const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute top-1/2 right-2 -translate-y-1/2 text-cyan-400 opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const UpdateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m-5 0l1.5 1.5A9 9 0 0119.95 15M20 20v-5h-5m5 0l-1.5-1.5A9 9 0 004.05 9" />
    </svg>
);

const ExportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ImportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const tutorialPages = [
  {
    title: "Bienvenue sur Horizon Invest",
    content: (
        <>
            <p className="mb-4">Cette application vous permet de suivre manuellement la performance de vos investissements de manière simple et visuelle.</p>
            <h3 className="font-bold text-white mb-2">1. Ajouter une position</h3>
            <p>Cliquez sur le bouton ci-dessous, situé en haut du tableau, pour ouvrir le panneau d'ajout.</p>
             <div className="my-3 p-4 bg-black/20 rounded-lg border border-white/10 flex justify-center">
                <div className="btn-glass btn-primary text-sm pointer-events-none">
                    <PlusIcon />
                    Ajouter une Position
                </div>
            </div>
            <h3 className="font-bold text-white mb-2 mt-4">2. Rechercher un actif</h3>
            <p>Commencez à taper le nom ou le ticker (ex: AAPL, CW8) de l'action ou de l'ETF que vous souhaitez ajouter. Sélectionnez-le dans la liste.</p>
            <h3 className="font-bold text-white mb-2 mt-4">3. Renseigner les montants</h3>
            <p>Indiquez le <strong>coût total</strong> de votre investissement (votre prix d'achat total) et sa <strong>valeur actuelle</strong> sur le marché.</p>
        </>
    )
  },
  {
    title: "Le Suivi Quotidien",
    content: (
        <>
            <p className="mb-4">L'intérêt de l'application est de suivre l'évolution de votre plus-value jour après jour.</p>
            <h3 className="font-bold text-white mb-2">1. Mettre à jour une valeur</h3>
            <p>Dans le tableau, cliquez simplement sur le <strong>"Coût Total"</strong> ou la <strong>"Valeur Actuelle"</strong> d'une position pour la modifier, comme montré ici :</p>
            <div className="my-3 p-4 bg-black/20 rounded-lg border border-white/10">
                <p className="text-sm text-gray-400 text-center mb-2">Exemple dans le tableau :</p>
                <div className="flex justify-between items-center bg-white/5 p-2 rounded-md">
                    <span className="text-white">Valeur Actuelle</span>
                    <div className="font-mono-nums cursor-pointer px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 group relative text-right text-white">
                        1 850,25 €
                        <EditIcon />
                    </div>
                </div>
            </div>
            <p>Entrez la nouvelle valeur et validez en appuyant sur 'Entrée' ou en cliquant en dehors du champ.</p>
            <h3 className="font-bold text-white mb-2 mt-4">2. Enregistrer un point sur le graphique</h3>
            <p>Après avoir mis à jour vos positions, le bouton <strong>"Mettre à jour"</strong> apparaîtra en haut du graphique. Cliquez dessus pour enregistrer la performance du jour.</p>
             <div className="my-3 p-4 bg-black/20 rounded-lg border border-white/10 flex justify-center">
                <div
                    className="btn-glass btn-primary animate-pulse-slow !py-1.5 !px-3 text-xs pointer-events-none"
                >
                    <UpdateIcon />
                    <span className="ml-2">Mettre à jour</span>
                </div>
            </div>
            <p className="mt-2 text-sm text-cyan-300">Astuce : Faites cela chaque jour ou chaque semaine pour construire un historique précis de vos performances !</p>
        </>
    )
  },
   {
    title: "Sauvegardez et Restaurez Vos Données",
    content: (
        <>
            <p className="mb-4">Cette application fonctionne sans compte utilisateur centralisé. Vos données vous appartiennent et restent sous votre contrôle.</p>
            <h3 className="font-bold text-white mb-2">L'importance de la sauvegarde locale</h3>
            <p>Pour une sécurité totale et pour pouvoir transférer vos données entre appareils, il est essentiel de créer des sauvegardes manuelles sur votre ordinateur. C'est la garantie de ne jamais perdre votre historique.</p>
            
            <h3 className="font-bold text-white mb-2 mt-4">1. Exporter une copie</h3>
            <p>En bas du tableau de bord, cliquez sur ce bouton pour télécharger un fichier <code className="text-xs bg-black/50 px-1 py-0.5 rounded">.json</code> contenant toutes vos données.</p>
             <div className="my-3 p-4 bg-black/20 rounded-lg border border-white/10 flex justify-center">
                <div className="btn-glass btn-neutral pointer-events-none">
                    <ExportIcon className="h-5 w-5 mr-2" />
                    Exporter une copie
                </div>
            </div>

            <h3 className="font-bold text-white mb-2 mt-4">2. Importer une copie</h3>
            <p>Utilisez ce bouton pour charger un fichier de sauvegarde. <strong className="text-red-400">Attention, cela écrasera vos données actuelles.</strong></p>
             <div className="my-3 p-4 bg-black/20 rounded-lg border border-white/10 flex justify-center">
                <div className="btn-glass btn-secondary pointer-events-none">
                    <ImportIcon className="h-5 w-5 mr-2" />
                    Importer une copie
                </div>
            </div>
        </>
    )
  },
  {
    title: "Explorez l'Application",
    content: (
       <>
            <p className="mb-4">Utilisez la barre latérale pour naviguer entre les différentes sections :</p>
            <ul className="space-y-4">
                <li className="flex items-start">
                    <span className="bg-emerald-600/50 text-emerald-300 text-xs font-bold px-2 py-1 rounded-full mr-3 mt-1">Tableau de Bord</span>
                    <div>
                        <p className="font-semibold text-white">Votre vue principale.</p>
                        <p>Consultez la synthèse, les graphiques de répartition et le tableau détaillé de vos positions.</p>
                    </div>
                </li>
                <li className="flex items-start">
                    <span className="bg-cyan-600/50 text-cyan-300 text-xs font-bold px-2 py-1 rounded-full mr-3 mt-1">Actualités</span>
                    <div>
                        <p className="font-semibold text-white">Analyses par l'IA.</p>
                        <p>Demandez à l'IA une analyse de marché sur n'importe quel sujet financier (un secteur, une action, une tendance...).</p>
                    </div>
                </li>
                 <li className="flex items-start">
                    <span className="bg-violet-600/50 text-violet-300 text-xs font-bold px-2 py-1 rounded-full mr-3 mt-1">Calendrier</span>
                     <div>
                        <p className="font-semibold text-white">Vos échéances clés.</p>
                        <p>Visualisez les dates de résultats et de dividendes de vos actions, et ajoutez vos propres événements manuels.</p>
                    </div>
                </li>
            </ul>
             <p className="mt-6 p-3 bg-black/20 rounded-lg border border-white/10 text-center">Vous êtes maintenant prêt à prendre le contrôle de votre portefeuille !</p>
       </>
    )
  }
];

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, tutorialPages.length - 1));
  };

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleClose = () => {
    onClose(dontShowAgain);
  };

  if (!isOpen) return null;

  const currentPageData = tutorialPages[currentPage];

  return (
    <div className="modal-wrapper open" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <div className="modal-backdrop" />
      <div className="modal-dialog dashboard-card flex flex-col !max-w-xl">
        <header className="p-6 border-b border-white/10">
          <h2 id="tutorial-title" className="text-xl font-bold text-white text-center">
            {currentPageData.title}
          </h2>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 prose-invert text-gray-300">
            {currentPageData.content}
        </main>

        <footer className="p-4 border-t border-white/10 flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <button 
                    onClick={handlePrev} 
                    disabled={currentPage === 0}
                    className="btn-glass btn-neutral !p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Page précédente"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                
                <div className="flex space-x-2">
                    {tutorialPages.map((_, index) => (
                        <span key={index} className={`block w-2.5 h-2.5 rounded-full transition-colors ${currentPage === index ? 'bg-white' : 'bg-white/30'}`}></span>
                    ))}
                </div>

                <button 
                    onClick={handleNext} 
                    disabled={currentPage === tutorialPages.length - 1}
                    className="btn-glass btn-neutral !p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Page suivante"
                >
                    <ArrowRightIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="dont-show-again" 
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="h-4 w-4 rounded bg-white/10 border-white/20 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="dont-show-again" className="ml-2 text-sm text-gray-400">Ne plus afficher cet onglet</label>
                </div>
                <button
                    onClick={handleClose}
                    className="btn-glass btn-primary w-full sm:w-auto"
                >
                    OK, j'ai compris !
                </button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default TutorialModal;