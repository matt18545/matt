import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { PortfolioPosition } from '../types';
import ReactMarkdown from 'react-markdown';

interface AiBriefingProps {
  positions: PortfolioPosition[];
  portfolioSummary: {
    totalGainLossPercent: number;
    currentValue: number;
  };
}

const LightbulbIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm3.95 2.95a1 1 0 010 1.414l-1 1a1 1 0 11-1.414-1.414l1-1a1 1 0 011.414 0zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM9 16a1 1 0 112 0v1a1 1 0 11-2 0v-1zM5.05 13.95a1 1 0 010-1.414l1-1a1 1 0 011.414 1.414l-1 1a1 1 0 01-1.414 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm3.95-7.05a1 1 0 010 1.414l-1 1a1 1 0 11-1.414-1.414l1-1a1 1 0 011.414 0zM10 4a6 6 0 100 12 6 6 0 000-12z" />
    </svg>
);

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const AiBriefing: React.FC<AiBriefingProps> = ({ positions, portfolioSummary }) => {
  const [briefing, setBriefing] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateBriefing = useCallback(async () => {
    if (positions.length === 0) {
        setError("Veuillez ajouter des positions à votre portefeuille avant de générer un bilan.");
        return;
    }

    if (!process.env.API_KEY) {
        setError("La fonctionnalité de bilan IA n'est pas configurée. L'administrateur doit fournir une clé API.");
        setIsLoading(false);
        return;
    }
    
    // Une clé unique représentant l'état actuel du portefeuille pour le cache.
    const cacheKey = `ai-briefing-cache-${portfolioSummary.currentValue.toFixed(2)}-${portfolioSummary.totalGainLossPercent.toFixed(2)}-${positions.length}`;
    
    // --- Logique de Cache (Lecture) ---
    try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            // FIX: Add type assertion to ensure TypeScript knows the shape of the parsed object, fixing the arithmetic operation error.
            const { briefing: cachedBriefing, timestamp } = JSON.parse(cachedItem) as { briefing: string, timestamp: number };
            if ((Date.now() - timestamp) < CACHE_DURATION_MS) {
                setBriefing(cachedBriefing);
                return; // On utilise le cache et on arrête la fonction ici
            } else {
                localStorage.removeItem(cacheKey); // Le cache a expiré
            }
        }
    } catch (e) {
        console.warn("Impossible de lire depuis le cache", e);
    }
    // --- Fin de la Logique de Cache ---


    setIsLoading(true);
    setError('');
    setBriefing('');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const performers = positions.map(p => ({
            name: p.name,
            gainLossPercent: p.totalCost !== 0 ? ((p.currentValue - p.totalCost) / p.totalCost) * 100 : 0
        })).sort((a, b) => b.gainLossPercent - a.gainLossPercent);

        const topPerformers = performers.slice(0, 3).map(p => `${p.name} (${p.gainLossPercent.toFixed(1)}%)`).join(', ');
        const worstPerformers = performers.slice(-3).reverse().map(p => `${p.name} (${p.gainLossPercent.toFixed(1)}%)`).join(', ');

        const sectorAllocation = positions.reduce((acc, position) => {
            const sector = position.sector || 'Non Catégorisé';
            acc[sector] = (acc[sector] || 0) + position.currentValue;
            return acc;
        }, {} as { [key: string]: number });

        const topSectors = Object.entries(sectorAllocation)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([sector]) => sector)
            .join(', ');

        const prompt = `
        Agis comme un analyste financier expert pour un investisseur particulier, spécialisé dans l'analyse des **informations de marché les plus récentes (moins de 24 heures)**. Ton ton doit être informatif, neutre, et perspicace. Ne donne JAMAIS de conseil d'investissement direct (ne dis jamais "acheter" ou "vendre").

        Ta mission est d'analyser le portefeuille suivant en te basant sur les données fournies ET les **actualités financières de dernière minute**. Consulte activement les sources d'information reconnues comme Reuters, Bloomberg, ou le Wall Street Journal pour fonder ton analyse sur les événements les plus récents, comme les mouvements de marché de la veille ou du jour même.

        **Données du portefeuille :**
        - Performance Globale : ${portfolioSummary.totalGainLossPercent.toFixed(2)}%
        - Valeur Totale : ${Math.round(portfolioSummary.currentValue)} €
        - Positions Clés (Top 3) : ${topPerformers || 'N/A'}
        - Positions à surveiller (Bottom 3) : ${worstPerformers || 'N/A'}
        - Secteurs les plus représentés : ${topSectors || 'N/A'}

        **Structure IMPÉRATIVE de la réponse (en Markdown) :**

        **## Bilan Synthétique**
        *   (Une phrase résumant la performance et l'état général du portefeuille, en lien avec le climat de marché du jour.)

        **## Contexte Macro-Économique Récent**
        *   (1 à 2 points clés sur les **événements économiques des dernières 24-48 heures** qui pourraient impacter le portefeuille. Ex: déclarations de banques centrales, chiffres de l'inflation, craintes sur un secteur spécifique comme les banques régionales américaines.)

        **## Observations sur les Positions**
        *   **[Nom de la 1ère action clé] :** (Une phrase sur une actualité **très recente** ou une variation de cours notable qui explique sa performance. Ex: "La volatilité sur [Action A] s'explique par les inquiétudes apparues hier concernant...")
        *   **[Nom de la 2ème action clé] :** (Une phrase similaire pour une autre position pertinente, en la connectant à un fait d'actualité précis et récent.)
        *   **[Point de vigilance sectoriel ou thématique] :** (Une phrase sur un risque ou une opportunité **actuelle** liée à un secteur dominant dans le portefeuille. Ex: "Le secteur [Secteur X], fortement représenté, est directement exposé à la récente hausse de la volatilité sur les marchés obligataires.")

        **## Perspective à Court Terme**
        *   (Une phrase de conclusion neutre suggérant des points de suivi immédiats. Ex: "La surveillance de la réaction des marchés à l'ouverture et des prochains indicateurs de [indicateur pertinent] sera déterminante.")
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        const briefingText = response.text;
        setBriefing(briefingText);

        // --- Logique de Cache (Écriture) ---
        try {
            const dataToCache = {
                briefing: briefingText,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        } catch (e) {
            console.warn("Impossible d'écrire dans le cache", e);
        }
        // --- Fin de la Logique de Cache ---

    } catch (err: unknown) {
        console.error("Erreur lors de l'appel à l'API Gemini", err);
        let errorMessage = "Impossible de générer le bilan pour le moment. Veuillez réessayer.";
        if (err instanceof Error) {
            if (err.message.includes('API key not valid')) {
                errorMessage = "La clé API est invalide. Veuillez contacter l'administrateur.";
            } else if (err.message.toLowerCase().includes('network') || err.message.toLowerCase().includes('fetch failed')) {
                errorMessage = "Erreur de réseau. Veuillez vérifier votre connexion et réessayer.";
            } else if (err.message.includes('429') || err.message.toLowerCase().includes('quota')) {
                errorMessage = "La limite de requêtes a été atteinte. Réessayez dans quelques instants.";
            } else if (err.message.includes('500')) {
                errorMessage = "Le service de bilan IA rencontre un problème. Veuillez réessayer plus tard.";
            }
        }
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }, [positions, portfolioSummary]);

  return (
    <div className="dashboard-card p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Bilan Stratégique par IA</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-lg">
            Obtenez une analyse de votre portefeuille basée sur les dernières actualités du marché.
          </p>
        </div>
        <button
          onClick={generateBriefing}
          disabled={isLoading || positions.length === 0}
          className="btn-glass btn-secondary flex-shrink-0 w-full sm:w-auto"
          title={positions.length === 0 ? "Ajoutez des positions pour activer cette fonctionnalité" : "Générer le bilan"}
        >
          {isLoading ? <LoadingSpinner /> : <LightbulbIcon />}
          <span className="ml-2">{isLoading ? 'Analyse...' : 'Générer le Bilan'}</span>
        </button>
      </div>
      <div className="mt-4 border-t border-white/10 pt-4">
        {isLoading ? (
          <div className="flex items-center text-gray-400 w-full">
            <LoadingSpinner />
            <span className="ml-3">L'IA analyse vos données et les tendances du marché...</span>
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : briefing ? (
          <div>
            <article className="prose prose-invert max-w-none">
                <ReactMarkdown>{briefing}</ReactMarkdown>
            </article>
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Cliquez sur le bouton pour obtenir votre synthèse personnalisée.
          </p>
        )}
      </div>
    </div>
  );
};

export default AiBriefing;