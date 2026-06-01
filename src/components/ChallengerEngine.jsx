'use client';

import React, { useState, useRef, useEffect } from 'react';
import { REGIONS, isRestrictedPokemon, usePokemonData } from '../hooks/usePokemonData';
import PokemonCard from './PokemonCard';
import PokemonSummaryModal from './PokemonSummaryModal';
import { getPokemonSpriteUrls } from '../utils/showdownSprites';

import { ruleBasedScore } from '../utils/mlModels';

const CARD_REVEAL_DURATION_MS = 400;
const CARD_REVEAL_STAGGER_MS = 150;
const CARD_BATCH_SIZE = 3;
const CHALLENGER_ENGINE_DRAFT_KEY = 'pokemonDayChallengerEngineDraftV1';

const getCardRevealDelay = (index) => {
    if (index < CARD_BATCH_SIZE) return index * CARD_REVEAL_STAGGER_MS;

    const firstBatchLastIndex = CARD_BATCH_SIZE - 1;
    const secondBatchStart = (firstBatchLastIndex * CARD_REVEAL_STAGGER_MS) + CARD_REVEAL_DURATION_MS;

    return secondBatchStart + ((index - CARD_BATCH_SIZE) * CARD_REVEAL_STAGGER_MS);
};

const loadImage = (src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = reject;
    image.src = src;
});

const preloadPokemonSprite = async (pokemon) => {
    const spriteUrls = getPokemonSpriteUrls(pokemon);

    for (const url of spriteUrls) {
        try {
            return await loadImage(url);
        } catch {
            // Try next sprite source if a URL fails.
        }
    }

    return '';
};

const preloadTeamSprites = async (team) => {
    const spriteUrls = await Promise.all(team.map(preloadPokemonSprite));

    return team.map((pokemon, index) => ({
        ...pokemon,
        preloadedSpriteUrl: spriteUrls[index],
    }));
};

export default function ChallengerEngine({ gymTeam, challengerTeam, setChallengerTeam, setChallengerMeta, onTypeChange }) {
    const { cache, loading, fetchDetails } = usePokemonData();
    const [generating, setGenerating] = useState(false);
    const [generationCount, setGenerationCount] = useState(0);
    const [selectedPokemonIndex, setSelectedPokemonIndex] = useState(null);
    const [query, setQuery] = useState('');
    const [region, setRegion] = useState('hoenn');
    const [modelStrategy, setModelStrategy] = useState('randomForest');
    const [searchResults, setSearchResults] = useState([]);
    const [draftHydrated, setDraftHydrated] = useState(false);
    const searchRef = useRef(null);
    const selectedPokemon = selectedPokemonIndex === null ? null : challengerTeam[selectedPokemonIndex];
    const gymPrimaryType = gymTeam?.[0]?.types?.[0]?.type?.name || '';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const raw = window.localStorage.getItem(CHALLENGER_ENGINE_DRAFT_KEY);
        if (raw) {
            try {
                const draft = JSON.parse(raw);
                setRegion(draft.region || 'hoenn');
                setModelStrategy(draft.modelStrategy || 'randomForest');
                setQuery(draft.query || '');
            } catch {
                // Ignore malformed saved drafts.
            }
        }
        setDraftHydrated(true);
    }, []);

    useEffect(() => {
        if (!draftHydrated || typeof window === 'undefined') return;
        window.localStorage.setItem(CHALLENGER_ENGINE_DRAFT_KEY, JSON.stringify({
            region,
            modelStrategy,
            query
        }));
    }, [draftHydrated, region, modelStrategy, query]);

    useEffect(() => {
        if (gymPrimaryType) onTypeChange?.(gymPrimaryType);
    }, [gymPrimaryType, onTypeChange]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        
        // Filter by region and search query
        let pool = cache;
        const bounds = REGIONS[region];
        pool = pool.filter(p => p.id >= bounds.start && p.id <= bounds.end && !isRestrictedPokemon(p));

        const matches = pool.filter(p => p.name.includes(val.toLowerCase())).slice(0, 10);
        setSearchResults(matches);
    };

    const addPokemon = async (id) => {
        if (challengerTeam.length >= 6) {
            alert("Team is already full (6 Pokemon max)!");
            setSearchResults([]);
            setQuery('');
            return;
        }
        const details = await fetchDetails(id);
        const preloadedSpriteUrl = await preloadPokemonSprite(details);
        setChallengerTeam(prev => [...prev, { ...details, preloadedSpriteUrl }]);
        setGenerationCount(count => count + 1);
        setSearchResults([]);
        setQuery('');
    };

    const removePokemon = (index) => {
        if (selectedPokemonIndex === index) setSelectedPokemonIndex(null);
        setChallengerTeam(prev => prev.filter((_, i) => i !== index));
    };

    const generateTeam = async () => {
        if (loading) return;
        setGenerating(true);
        setSelectedPokemonIndex(null);
        try {
            let available = [...cache].filter(p => !isRestrictedPokemon(p));
            
            // Native Region Rule
            const bounds = REGIONS[region];
            available = available.filter(p => p.id >= bounds.start && p.id <= bounds.end);

            // We need details for all available pokemon for stats and types
            // To prevent massive API calls, we'll take a subset to evaluate
            let candidatePoolIds = [];
            available.sort(() => 0.5 - Math.random()); // Shuffle
            for (let i = 0; i < Math.min(20, available.length); i++) {
                candidatePoolIds.push(available[i].id);
            }
            
            const candidatePool = await Promise.all(candidatePoolIds.map(id => fetchDetails(id)));

            // Instead of running models locally, fetch from Python Backend
            const response = await fetch('/api/select_team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gymTeam: gymTeam,
                    candidatePool: candidatePool,
                    modelStrategy: modelStrategy
                })
            });
            
            if (!response.ok) {
                let message = 'Failed to fetch team from backend';
                try {
                    const errPayload = await response.json();
                    if (errPayload?.error) message = errPayload.error;
                } catch {
                    // Keep default message if JSON parsing fails.
                }
                throw new Error(message);
            }
            
            const data = await response.json();
            const selectedTeam = data.team || [];
            const finalTeam = await preloadTeamSprites(selectedTeam);
            setGenerationCount(count => count + 1);
            setChallengerTeam(finalTeam);

            if (setChallengerMeta) {
                const avgScore = selectedTeam.reduce((sum, p) => sum + ruleBasedScore(p, gymTeam), 0) / (selectedTeam.length || 1);
                setChallengerMeta({
                    model: modelStrategy,
                    avgScore: Math.round(avgScore)
                });
            }
        } catch (error) {
            console.error(error);
            alert(error?.message || 'Failed to fetch team from backend');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <section className="engine-section active glass-panel">
            <h2 style={{ display: 'block', textAlign: 'center' }}>Challenger Selection Engine</h2>
            
            <div className="controls">
                <div className="control-group">
                    <label htmlFor="challenger-region">Native Region Rule:</label>
                    <select id="challenger-region" value={region} onChange={e => setRegion(e.target.value)}>
                        {Object.entries(REGIONS).map(([key, value]) => (
                            <option key={key} value={key}>{value.label} (Gen {value.generation})</option>
                        ))}
                    </select>
                </div>
                <div className="control-group">
                    <label htmlFor="challenger-model">Selection Model:</label>
                    <select id="challenger-model" value={modelStrategy} onChange={e => setModelStrategy(e.target.value)}>
                        <option value="kMeans">K-Means (Role Clusters)</option>
                        <option value="randomForest">Random Forest (Ensemble)</option>
                        <option value="knn">K-NN (Stat Similarity)</option>
                        <option value="cosine">Cosine Similarity (Stat Profile)</option>
                        <option value="gower">Gower Distance (Mixed Features)</option>
                        <option value="decisionTree">Decision Tree (Role Classifier)</option>
                        <option value="ruleBased">Rule-Based Scoring</option>
                        <option value="diversity">Diversity + BST</option>
                    </select>
                </div>
                <button 
                    className="primary-btn" 
                    onClick={generateTeam}
                    disabled={generating || loading}
                >
                    {generating ? 'Running Algorithm...' : 'Auto-Generate Lineup'}
                </button>
                <div className="search-box" style={{ position: 'relative', flexGrow: 1 }} ref={searchRef}>
                    <input 
                        type="text" 
                        placeholder="Search Pokemon to add..."
                        value={query}
                        onChange={handleSearch}
                        style={{width: '100%'}}
                    />
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map(m => (
                                <div 
                                    className="search-result"
                                    key={m.id} 
                                    onClick={() => addPokemon(m.id)}
                                >
                                    {m.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {generating ? (
                <div className="team-loading-wrap" role="status" aria-live="polite">
                    <div className="team-loading-grid">
                        {Array.from({ length: 6 }, (_, index) => (
                            <div className="pokemon-card team-loading-card" key={index}>
                                <div className="css-pokeball" aria-hidden="true"></div>
                            </div>
                        ))}
                    </div>
                    <div className="team-loading-text">
                        SELECTING TEAM<span className="loading-ellipsis">...</span>
                    </div>
                </div>
            ) : challengerTeam.length === 0 ? (
                <div className="empty-team-state">
                    <svg className="empty-pokeball" viewBox="0 0 32 32" aria-hidden="true">
                        <rect x="6" y="8" width="20" height="6" />
                        <rect x="4" y="14" width="24" height="4" />
                        <rect x="6" y="18" width="20" height="6" />
                        <rect x="13" y="13" width="6" height="6" />
                        <rect x="15" y="15" width="2" height="2" />
                    </svg>
                    <p>NO CHALLENGER DATA</p>
                </div>
            ) : (
                <div className="pokemon-grid">
                    {challengerTeam.map((pokemon, idx) => (
                        <PokemonCard
                            key={`${pokemon.name}-${generationCount}-${idx}`}
                            pokemon={pokemon}
                            className="card-enter"
                            style={{ animationDelay: `${getCardRevealDelay(idx)}ms` }}
                            onClick={() => setSelectedPokemonIndex(idx)}
                            onRemove={() => removePokemon(idx)}
                        />
                    ))}
                </div>
            )}

            {selectedPokemon && (
                <PokemonSummaryModal
                    pokemon={selectedPokemon}
                    team={challengerTeam}
                    selectedIndex={selectedPokemonIndex}
                    onSelectIndex={setSelectedPokemonIndex}
                    onClose={() => setSelectedPokemonIndex(null)}
                />
            )}
        </section>
    );
}

