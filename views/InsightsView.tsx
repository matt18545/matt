import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <svg className="animate-spin h-8 w-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-4 text-gray-300">Analyse en cours...</span>
    </div>
);

const InsightsView: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;

        if (!process.env.API_KEY) {
            setError("La fonctionnalité d'analyse IA n'est pas configurée. L'administrateur doit fournir une clé API.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setResult('');
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Agis comme un analyste financier expert, réputé pour la clarté et la concision de ses analyses. Fournis une analyse sur le sujet suivant : "${query}".
Ta réponse doit être structurée exclusivement en Markdown pour une lisibilité maximale. Sois synthétique et va droit au but.

**Structure IMPÉRATIVE de la réponse :**

**## Le Point Clé**
*   [Premier point clé]
*   [Deuxième point clé]
*   [Troisième point clé]
**Conclusion :** [Une phrase de conclusion percutante.]

**## Analyse Synthétique**
### Contexte Actuel
(2-3 phrases maximum pour résumer la situation.)

### Points Forts
*   [Principal atout ou opportunité]
*   [Second atout ou opportunité]

### Points de Vigilance
*   [Principal risque ou faiblesse]
*   [Second risque ou faiblesse]

**## Indicateurs Clés**
*   **Sentiment IA :** [Haussier, Baissier, ou Neutre]
*   **Volatilité :** [Faible, Modérée, ou Élevée]
*   **Risque Principal :** [Identifier le risque le plus critique en une phrase.]

**## Pour aller plus loin**
*   [Première piste de recherche pertinente.]
*   [Seconde piste de recherche pertinente.]`;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            setResult(response.text);

        } catch (err: unknown) {
            console.error("Erreur lors de l'appel à l'API Gemini", err);
            let errorMessage = "Désolé, une erreur inattendue est survenue. Veuillez réessayer.";
            if (err instanceof Error) {
                if (err.message.includes('API key not valid')) {
                    errorMessage = "La clé API est invalide. Veuillez contacter l'administrateur de l'application.";
                } else if (err.message.toLowerCase().includes('network') || err.message.toLowerCase().includes('fetch failed')) {
                    errorMessage = "Erreur de réseau. Veuillez vérifier votre connexion internet et réessayer.";
                } else if (err.message.includes('429') || err.message.toLowerCase().includes('quota')) {
                    errorMessage = "La limite de requêtes a été atteinte. Veuillez réessayer plus tard.";
                } else if (err.message.includes('500')) {
                    errorMessage = "Le service d'analyse IA rencontre un problème technique. Veuillez réessayer plus tard.";
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Actualités Financières</h1>
                <p className="mt-2 text-lg text-gray-300">Obtenez des analyses de marché générées par l'IA.</p>
            </header>
            
            <div className="dashboard-card p-6">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Ex: 'Analyse du marché des semi-conducteurs'"
                        className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="btn-glass btn-secondary sm:w-36"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <SearchIcon />
                                <span className="ml-2 hidden sm:inline">Rechercher</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-red-500 text-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">{error}</p>}
                {result && (
                    <div className="dashboard-card p-6 md:p-8">
                        <article className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-cyan-400 prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300">
                           <ReactMarkdown>{result}</ReactMarkdown>
                        </article>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightsView;