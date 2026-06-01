import { memo } from 'react';
import ShowdownSprite from './ShowdownSprite';

function PokemonCard({ pokemon, onRemove, onClick, className = '', style }) {
    const typeColors = {
        fire: '#e84820', water: '#3090f0', grass: '#58c020', fighting: '#c83010',
        psychic: '#d040c0', electric: '#e8d000', ice: '#60d0e8', rock: '#b8902a',
        ghost: '#6840a0', dragon: '#3040d0', dark: '#483828', steel: '#90a0b0',
        poison: '#a040b0', normal: '#b8a888', ground: '#d0a848', flying: '#88a8e8',
        bug: '#a0b820', fairy: '#d885c8'
    };

    const getStatBarColor = (value) => {
        if (value <= 49) return '#e83030';
        if (value <= 89) return '#e8a020';
        if (value <= 119) return '#d0d020';
        return '#30c030';
    };

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

    const getRole = (hp, atk, def, spa, spd, spe) => {
        const stats = { HP: hp, Attack: atk, Defense: def, 'Sp. Atk': spa, 'Sp. Def': spd, Speed: spe };
        const highest = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
        if (highest === 'Speed') return 'Fast Attacker';
        if (highest === 'Attack') return 'Physical Attacker';
        if (highest === 'Sp. Atk') return 'Special Attacker';
        if (highest === 'Defense') return 'Physical Wall';
        if (highest === 'Sp. Def') return 'Special Wall';
        return 'Tank';
    };

    // Extract base stats
    const getStat = (name) => pokemon.stats.find(s => s.stat.name === name)?.base_stat || 0;
    const hp = getStat('hp');
    const atk = getStat('attack');
    const def = getStat('defense');
    const spa = getStat('special-attack');
    const spd = getStat('special-defense');
    const spe = getStat('speed');

    const primaryType = pokemon.types[0]?.type.name.toLowerCase();
    const borderColor = typeColors[primaryType] || '#b8a888';
    const handleAnimationEnd = (event) => {
        if (event.animationName === 'cardStepIn') {
            event.currentTarget.classList.add('card-entered');
        }
    };
    const handleKeyDown = (event) => {
        if (!onClick) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    };

    const StatRow = ({ label, value }) => (
        <div className="stat-row">
            <span className="stat-label">{label}</span>
            <div className="stat-bar-outer">
                <div className="stat-bar-fill" style={{ width: `calc(${value} / 255 * 100%)`, backgroundColor: getStatBarColor(value) }}></div>
            </div>
            <span className="stat-value">{value}</span>
        </div>
    );

    return (
        <div className="pokemon-card-wrap">
            {onRemove && (
                <button
                    className="remove-pokemon-btn"
                    onClick={(event) => {
                        event.stopPropagation();
                        onRemove();
                    }}
                    aria-label={`Remove ${pokemon.name}`}
                >
                    X
                </button>
            )}
            <div
                className={`pokemon-card ${className}`.trim()}
                style={{ ...style, borderLeft: `4px solid ${borderColor}` }}
                onAnimationEnd={handleAnimationEnd}
                onClick={onClick}
                onKeyDown={handleKeyDown}
                role={onClick ? 'button' : undefined}
                tabIndex={onClick ? 0 : undefined}
            >
                <ShowdownSprite pokemon={pokemon} />
                <h3>{pokemon.name}</h3>
                <div className="pokemon-types">
                    {pokemon.types.map(t => (
                        <span key={t.type.name} className={`type-badge type-${t.type.name}`}>
                            {t.type.name}
                        </span>
                    ))}
                </div>

                <div className="pokemon-stat-grid">
                    <StatRow label="HP" value={hp} />
                    <StatRow label="Atk" value={atk} />
                    <StatRow label="Def" value={def} />
                    <StatRow label="SpA" value={spa} />
                    <StatRow label="SpD" value={spd} />
                    <StatRow label="Spe" value={spe} />
                </div>
                <div className="pokemon-meta">
                    <div><b>Region:</b> {getRegion(pokemon.id)}</div>
                    <div><b>Role:</b> {getRole(hp, atk, def, spa, spd, spe)}</div>
                </div>
            </div>
        </div>
    );
}

export default memo(PokemonCard);
