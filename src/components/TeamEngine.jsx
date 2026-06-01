'use client';

import { useEffect, useMemo, useState } from 'react';
import { REGIONS, TYPE_SPECIALIZATIONS, isRestrictedPokemon, usePokemonData } from '../hooks/usePokemonData';
import { getPokemonSpriteUrls } from '../utils/showdownSprites';
import PokemonCard from './PokemonCard';
import PokemonSummaryModal from './PokemonSummaryModal';

const CARD_REVEAL_DURATION_MS = 400;
const CARD_REVEAL_STAGGER_MS = 150;
const CARD_BATCH_SIZE = 3;
const TEAM_ENGINE_DRAFT_KEY = 'pokemonDayTeamEngineDraftV1';

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
            // Try the next sprite source so cards never mount with a broken image.
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

export default function TeamEngine({ gymTeam, setGymTeam, onTypeGenerated }) {
    const { cache, loading, fetchDetails } = usePokemonData();
    const [region, setRegion] = useState('hoenn');
    const [typeSpecialization, setTypeSpecialization] = useState('water');
    const [generating, setGenerating] = useState(false);
    const [generationCount, setGenerationCount] = useState(0);
    const [selectedPokemonIndex, setSelectedPokemonIndex] = useState(null);
    const [error, setError] = useState('');
    const [draftHydrated, setDraftHydrated] = useState(false);
    const isLoading = generating;
    const selectedPokemon = selectedPokemonIndex === null ? null : gymTeam[selectedPokemonIndex];
    const teamCards = useMemo(() => (
        gymTeam.map((pokemon, idx) => (
            <PokemonCard
                key={`${pokemon.name}-${generationCount}`}
                pokemon={pokemon}
                className="card-enter"
                style={{ animationDelay: `${getCardRevealDelay(idx)}ms` }}
                onClick={() => setSelectedPokemonIndex(idx)}
            />
        ))
    ), [generationCount, gymTeam]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const raw = window.localStorage.getItem(TEAM_ENGINE_DRAFT_KEY);
        if (raw) {
            try {
                const draft = JSON.parse(raw);
                setRegion(draft.region || 'hoenn');
                setTypeSpecialization(draft.typeSpecialization || 'water');
            } catch {
                // Ignore malformed saved drafts.
            }
        }
        setDraftHydrated(true);
    }, []);

    useEffect(() => {
        if (!draftHydrated || typeof window === 'undefined') return;
        window.localStorage.setItem(TEAM_ENGINE_DRAFT_KEY, JSON.stringify({
            region,
            typeSpecialization,
        }));
    }, [draftHydrated, region, typeSpecialization]);

    useEffect(() => {
        onTypeGenerated?.(typeSpecialization);
    }, [onTypeGenerated, typeSpecialization]);

    const generateTeam = async () => {
        if (loading) return;
        setGenerating(true);
        setSelectedPokemonIndex(null);
        setError('');
        
        try {
            let available = [...cache].filter(p => !isRestrictedPokemon(p));
            
            // Apply Region Native Filter
            const bounds = REGIONS[region];
            available = available.filter(p => p.id >= bounds.start && p.id <= bounds.end);

            let finalTeam = [];
            const details = await Promise.all(available.map(p => fetchDetails(p.id)));
            const typedCandidates = details.filter(pokemon =>
                pokemon.types.some(t => t.type.name === typeSpecialization)
            );

            if (typedCandidates.length === 0) {
                setError(`No eligible ${REGIONS[region].label}-native ${typeSpecialization} Pokemon found.`);
                setGymTeam([]);
                return;
            }

            let selected = [];
            let usedRoles = new Set();

            const getStat = (pokemon, statName) => pokemon.stats.find(s => s.stat.name === statName)?.base_stat || 0;
            const getRole = (pokemon) => {
                const attack = getStat(pokemon, 'attack');
                const specialAttack = getStat(pokemon, 'special-attack');
                const defense = getStat(pokemon, 'defense');
                const specialDefense = getStat(pokemon, 'special-defense');
                const speed = getStat(pokemon, 'speed');

                if (speed >= 95 && Math.max(attack, specialAttack) >= 85) return 'sweeper';
                if (attack > specialAttack + 20) return 'physical';
                if (specialAttack > attack + 20) return 'special';
                if (defense + specialDefense >= 190) return 'wall';
                return 'balanced';
            };

            const scorePokemon = (pokemon) => {
                const bst = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
                const role = getRole(pokemon);
                const rolePenalty = usedRoles.has(role) ? 35 : 0;
                const offTypeBonus = pokemon.types.length > 1 ? 20 : 0;
                return bst + offTypeBonus - rolePenalty;
            };

            const remaining = [...typedCandidates];
            while (selected.length < 6 && remaining.length > 0) {
                remaining.sort((a, b) => scorePokemon(b) - scorePokemon(a));
                const best = remaining.shift();
                selected.push(best);
                usedRoles.add(getRole(best));
            }

            finalTeam = await preloadTeamSprites(selected);
            setGenerationCount(count => count + 1);
            setGymTeam(finalTeam);
            onTypeGenerated?.(typeSpecialization);
        } catch (err) {
            console.error(err);
            setError('Error generating team. Try again.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <section className="engine-section active glass-panel">
            <h2 style={{ display: 'block', textAlign: 'center' }}>Gym Leader Team Engine</h2>
            <div className="controls">
                <div className="control-group">
                    <label htmlFor="region-filter">Native Region:</label>
                    <select id="region-filter" value={region} onChange={e => setRegion(e.target.value)}>
                        {Object.entries(REGIONS).map(([key, value]) => (
                            <option key={key} value={key}>{value.label} (Gen {value.generation})</option>
                        ))}
                    </select>
                </div>
                <div className="control-group">
                    <label htmlFor="type-specialization">Type Specialization:</label>
                    <select id="type-specialization" value={typeSpecialization} onChange={e => setTypeSpecialization(e.target.value)}>
                        {TYPE_SPECIALIZATIONS.map(type => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <button 
                    className="primary-btn" 
                    onClick={generateTeam} 
                    disabled={isLoading || loading}
                >
                    {isLoading ? 'Selecting Team...' : 'Generate Balanced Team'}
                </button>
            </div>
            
            {error && <div style={{color: 'var(--danger)', marginBottom: '1rem'}}>{error}</div>}
            
            {isLoading ? (
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
            ) : (
                <div className="pokemon-grid">
                    {teamCards}
                </div>
            )}

            {selectedPokemon && (
                <PokemonSummaryModal
                    pokemon={selectedPokemon}
                    team={gymTeam}
                    selectedIndex={selectedPokemonIndex}
                    onSelectIndex={setSelectedPokemonIndex}
                    onClose={() => setSelectedPokemonIndex(null)}
                />
            )}
        </section>
    );
}

