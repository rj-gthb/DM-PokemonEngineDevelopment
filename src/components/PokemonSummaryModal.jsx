'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import ShowdownSprite from './ShowdownSprite';

const STAT_ROWS = [
    ['HP', 'hp'],
    ['Atk', 'attack'],
    ['Def', 'defense'],
    ['SpA', 'special-attack'],
    ['SpD', 'special-defense'],
    ['Spe', 'speed'],
];

const TYPE_CHART = {
    normal: { weak: ['fighting'], resist: [], immune: ['ghost'] },
    fire: { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] },
    water: { weak: ['electric', 'grass'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] },
    electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] },
    grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'electric', 'grass', 'ground'], immune: [] },
    ice: { weak: ['fire', 'fighting', 'rock', 'steel'], resist: ['ice'], immune: [] },
    fighting: { weak: ['flying', 'psychic', 'fairy'], resist: ['bug', 'rock', 'dark'], immune: [] },
    poison: { weak: ['ground', 'psychic'], resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immune: [] },
    ground: { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
    flying: { weak: ['electric', 'ice', 'rock'], resist: ['grass', 'fighting', 'bug'], immune: ['ground'] },
    psychic: { weak: ['bug', 'ghost', 'dark'], resist: ['fighting', 'psychic'], immune: [] },
    bug: { weak: ['fire', 'flying', 'rock'], resist: ['grass', 'fighting', 'ground'], immune: [] },
    rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'], immune: [] },
    ghost: { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
    dragon: { weak: ['ice', 'dragon', 'fairy'], resist: ['fire', 'water', 'electric', 'grass'], immune: [] },
    dark: { weak: ['fighting', 'bug', 'fairy'], resist: ['ghost', 'dark'], immune: ['psychic'] },
    steel: { weak: ['fire', 'fighting', 'ground'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immune: ['poison'] },
    fairy: { weak: ['poison', 'steel'], resist: ['fighting', 'bug', 'dark'], immune: ['dragon'] },
};

const ALL_TYPES = Object.keys(TYPE_CHART);

const getRegion = (id) => {
    if (id <= 151) return 'Kanto';
    if (id <= 251) return 'Johto';
    if (id <= 386) return 'Hoenn';
    if (id <= 493) return 'Sinnoh';
    if (id <= 649) return 'Unova';
    if (id <= 721) return 'Kalos';
    if (id <= 809) return 'Alola';
    return 'Galar';
};

const getStatValue = (pokemon, statName) => (
    pokemon.stats.find(stat => stat.stat.name === statName)?.base_stat || 0
);

const getRole = (stats) => {
    const highest = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);

    if (highest === 'Speed') return 'Fast Attacker';
    if (highest === 'Attack') return 'Physical Attacker';
    if (highest === 'Sp. Atk') return 'Special Attacker';
    if (highest === 'Defense') return 'Physical Wall';
    if (highest === 'Sp. Def') return 'Special Wall';
    return 'Tank';
};

const getStatTone = (value) => {
    if (value >= 90) return 'high';
    if (value >= 60) return 'mid';
    return 'low';
};

const getAbility = (pokemon) => (
    pokemon.abilities?.find(ability => !ability.is_hidden)?.ability?.name
    || pokemon.abilities?.[0]?.ability?.name
    || 'Unknown'
);

const formatName = (name) => name.replaceAll('-', ' ');

const getSpeciesName = (pokemon) => pokemon.species?.name || pokemon.name;

const getPokedexNumber = (pokemon) => `#${String(pokemon.id || 0).padStart(4, '0')}`;

const getGenderRatio = (genderRate) => {
    if (genderRate === null || genderRate === undefined) return '';
    if (genderRate === -1) return 'Genderless';

    const female = (genderRate / 8) * 100;
    const male = 100 - female;

    return `♂ ${male}% / ♀ ${female}%`;
};

const getMatchups = (pokemonTypes) => (
    ALL_TYPES.map((attackType) => {
        const multiplier = pokemonTypes.reduce((total, defenseType) => {
            const chart = TYPE_CHART[defenseType];
            if (chart.immune.includes(attackType)) return total * 0;
            if (chart.weak.includes(attackType)) return total * 2;
            if (chart.resist.includes(attackType)) return total * 0.5;
            return total;
        }, 1);

        return { type: attackType, multiplier };
    }).filter(({ multiplier }) => multiplier >= 2 || multiplier <= 0.5)
);

const getDexNumberFromUrl = (url) => {
    const match = url.match(/\/pokemon-species\/(\d+)\//);
    return match ? Number(match[1]) : null;
};

const formatEvolutionTrigger = (detail) => {
    if (!detail) return '';
    if (detail.min_level) return `Lv.${detail.min_level}`;
    if (detail.item?.name) return formatName(detail.item.name);
    if (detail.trigger?.name) return formatName(detail.trigger.name);
    if (detail.min_happiness) return `happy ${detail.min_happiness}`;
    if (detail.known_move?.name) return formatName(detail.known_move.name);
    if (detail.location?.name) return formatName(detail.location.name);

    return 'evolves';
};

const parseEvolutionChain = (chain) => {
    const stages = [];

    const walk = (node, trigger = '') => {
        if (!node?.species?.name) return;

        stages.push({
            name: node.species.name,
            dexNumber: getDexNumberFromUrl(node.species.url),
            trigger,
        });

        node.evolves_to.forEach((nextNode) => {
            walk(nextNode, formatEvolutionTrigger(nextNode.evolution_details?.[0]));
        });
    };

    walk(chain);
    return stages;
};

const getShowdownText = (pokemon) => {
    const nameCap = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    return [
        nameCap,
        'Level: 50',
        'EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe',
        'Serious Nature',
    ].join('\n');
};

export default function PokemonSummaryModal({ pokemon, team = [], selectedIndex = 0, onSelectIndex, onClose }) {
    const [isClosing, setIsClosing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shiny, setShiny] = useState(false);
    const [evolutionState, setEvolutionState] = useState({ loading: true, stages: [] });
    const [speciesInfo, setSpeciesInfo] = useState(null);
    const stats = useMemo(() => ({
        HP: getStatValue(pokemon, 'hp'),
        Attack: getStatValue(pokemon, 'attack'),
        Defense: getStatValue(pokemon, 'defense'),
        'Sp. Atk': getStatValue(pokemon, 'special-attack'),
        'Sp. Def': getStatValue(pokemon, 'special-defense'),
        Speed: getStatValue(pokemon, 'speed'),
    }), [pokemon]);

    const role = getRole(stats);
    const ability = getAbility(pokemon);
    const baseStatTotal = Object.values(stats).reduce((total, value) => total + value, 0);
    const currentSpeciesName = getSpeciesName(pokemon);
    const matchups = getMatchups(pokemon.types.map(type => type.type.name));
    const canNavigate = team.length > 1 && selectedIndex !== null && onSelectIndex;

    const requestClose = useCallback(() => {
        if (isClosing) return;
        setIsClosing(true);
    }, [isClosing]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(getShowdownText(pokemon));
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
    };
    const navigateTeam = (direction) => {
        if (!canNavigate) return;
        onSelectIndex((selectedIndex + direction + team.length) % team.length);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') requestClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [requestClose]);

    useEffect(() => {
        if (!isClosing) return undefined;

        const timeout = window.setTimeout(onClose, 200);
        return () => window.clearTimeout(timeout);
    }, [isClosing, onClose]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchEvolutionChain = async () => {
            setEvolutionState({ loading: true, stages: [] });
            setSpeciesInfo(null);

            try {
                const speciesResponse = await fetch(
                    `https://pokeapi.co/api/v2/pokemon-species/${currentSpeciesName}`,
                    { signal: controller.signal }
                );
                const species = await speciesResponse.json();
                const chainResponse = await fetch(species.evolution_chain.url, { signal: controller.signal });
                const chainData = await chainResponse.json();

                setSpeciesInfo({
                    genderRate: species.gender_rate,
                    catchRate: species.capture_rate,
                    baseHappiness: species.base_happiness,
                });
                setEvolutionState({
                    loading: false,
                    stages: parseEvolutionChain(chainData.chain),
                });
            } catch (error) {
                if (error.name === 'AbortError') return;
                setEvolutionState({ loading: false, stages: [] });
            }
        };

        fetchEvolutionChain();

        return () => controller.abort();
    }, [currentSpeciesName]);

    return createPortal((
        <div
            className={`summary-overlay ${isClosing ? 'closing' : ''}`}
            onClick={requestClose}
        >
            <div
                className={`summary-modal ${isClosing ? 'closing' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label={`${pokemon.name} summary`}
                onClick={event => event.stopPropagation()}
            >
                {canNavigate && (
                    <>
                        <button className="summary-nav-btn prev" type="button" onClick={() => navigateTeam(-1)} aria-label="Previous team member">
                            ◀
                        </button>
                        <button className="summary-nav-btn next" type="button" onClick={() => navigateTeam(1)} aria-label="Next team member">
                            ▶
                        </button>
                    </>
                )}
                <div className="summary-topbar">
                    <span>{getPokedexNumber(pokemon)} {pokemon.name}</span>
                    <span>Lv.50</span>
                </div>

                <div className="summary-body">
                    <div className="summary-sprite-panel">
                        <button className="summary-shiny-btn" type="button" onClick={() => setShiny(current => !current)} aria-label="Toggle shiny sprite">
                            ✨
                        </button>
                        <ShowdownSprite pokemon={pokemon} className="summary-sprite" shiny={shiny} />
                    </div>

                    <div className="summary-info-panel">
                        <div className="summary-stats-table">
                            {STAT_ROWS.map(([label, statName]) => {
                                const value = getStatValue(pokemon, statName);
                                const width = `${Math.min(value, 150) / 150 * 100}%`;

                                return (
                                    <div className="summary-stat-row" key={statName}>
                                        <span className="summary-stat-label">{label}</span>
                                        <span className="summary-stat-value">{value}</span>
                                        <span className="summary-stat-track">
                                            <span
                                                className={`summary-stat-fill ${getStatTone(value)}`}
                                                style={{ width }}
                                            />
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="summary-detail-block">
                            <div className="summary-types">
                                {pokemon.types.map(type => (
                                    <span key={type.type.name} className={`type-badge type-${type.type.name}`}>
                                        {type.type.name}
                                    </span>
                                ))}
                            </div>
                            <div><b>Region:</b> {getRegion(pokemon.id)}</div>
                            <div><b>Ability:</b> <span className="summary-ability-value">{formatName(ability)}</span></div>
                            <div><b>Role:</b> {role}</div>
                            <div className="summary-bst"><b>BST:</b> {baseStatTotal}</div>
                            {speciesInfo && (
                                <>
                                    <div className="summary-species-meta">{getGenderRatio(speciesInfo.genderRate)}</div>
                                    <div className="summary-species-meta">Catch {speciesInfo.catchRate} / Happy {speciesInfo.baseHappiness}</div>
                                </>
                            )}
                            <div className="summary-matchups-section">
                                {matchups.some(m => m.multiplier > 1) && (
                                    <div className="summary-matchups-group">
                                        <div className="summary-matchup-label">WEAKNESSES</div>
                                        <div className="summary-matchups-row">
                                            {matchups.filter(m => m.multiplier > 1).map(({ type, multiplier }) => (
                                                <span className={`summary-matchup-chip type-${type}`} key={type}>
                                                    {type} {multiplier}×
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {matchups.some(m => m.multiplier < 1) && (
                                    <div className="summary-matchups-group">
                                        <div className="summary-matchup-label">RESISTANCES</div>
                                        <div className="summary-matchups-row">
                                            {matchups.filter(m => m.multiplier < 1).map(({ type, multiplier }) => (
                                                <span className={`summary-matchup-chip type-${type}`} key={type}>
                                                    {type} {multiplier}×
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="summary-evolution-block">
                            <div className="summary-evolution-label">EVOLUTION CHAIN</div>
                            {evolutionState.loading ? (
                                <div className="summary-evolution-empty">Loading evo chain...</div>
                            ) : evolutionState.stages.length <= 1 ? (
                                <div className="summary-evolution-empty">Does not evolve</div>
                            ) : (
                                <div className="summary-evolution-chain">
                                    {evolutionState.stages.map((stage, index) => (
                                        <div className="summary-evolution-segment" key={`${stage.name}-${index}`}>
                                            {index > 0 && (
                                                <div className="summary-evolution-link">
                                                    <span className="summary-evolution-trigger">{stage.trigger}</span>
                                                    <span className="summary-evolution-arrow" aria-hidden="true">➤</span>
                                                </div>
                                            )}
                                            <div className="summary-evolution-stage">
                                                <ShowdownSprite
                                                    pokemon={{ name: stage.name }}
                                                    className={`summary-evolution-sprite ${stage.name === currentSpeciesName ? 'current' : ''}`}
                                                />
                                                <span className="summary-evolution-name">{formatName(stage.name)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="summary-bottombar">
                    <button className="summary-confirm-btn" type="button" onClick={handleCopy}>
                        {copied ? 'COPIED!' : <><span className="gba-btn-icon a-btn">A</span> CONFIRM</>}
                    </button>
                    <button className="summary-back-btn" type="button" onClick={requestClose}>
                        <span className="gba-btn-icon b-btn">B</span> BACK
                    </button>
                </div>
            </div>
        </div>
    ), document.body);
}

