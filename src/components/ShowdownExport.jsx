'use client';

import React, { useState } from 'react';

const formatName = (raw = '') =>
    raw
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const getAbilityName = (pokemon) => {
    const ability = pokemon?.abilities?.find(a => !a.is_hidden) || pokemon?.abilities?.[0];
    return ability?.ability?.name ? formatName(ability.ability.name) : '[ability name]';
};

const MOVE_POOL = {
    water: { physical: ['waterfall', 'liquidation', 'aqua-tail'], special: ['surf', 'hydro-pump', 'scald'], status: ['rain-dance', 'haze', 'aqua-ring'] },
    fire: { physical: ['flare-blitz', 'fire-punch', 'blaze-kick'], special: ['flamethrower', 'fire-blast', 'heat-wave'], status: ['will-o-wisp', 'sunny-day', 'calm-mind'] },
    grass: { physical: ['power-whip', 'seed-bomb', 'leaf-blade'], special: ['giga-drain', 'energy-ball', 'leaf-storm'], status: ['leech-seed', 'synthesis', 'sleep-powder'] },
    electric: { physical: ['wild-charge', 'thunder-punch', 'volt-tackle'], special: ['thunderbolt', 'volt-switch', 'thunder'], status: ['thunder-wave', 'charge', 'light-screen'] },
    psychic: { physical: ['zen-headbutt', 'psycho-cut'], special: ['psychic', 'psyshock', 'stored-power'], status: ['calm-mind', 'trick-room', 'light-screen'] },
    fighting: { physical: ['close-combat', 'drain-punch', 'brick-break'], special: ['focus-blast', 'aura-sphere', 'vacuum-wave'], status: ['bulk-up', 'detect', 'swords-dance'] },
    ground: { physical: ['earthquake', 'high-horsepower', 'stomping-tantrum'], special: ['earth-power', 'mud-shot', 'scorching-sands'], status: ['stealth-rock', 'sandstorm', 'rock-polish'] },
    dark: { physical: ['crunch', 'knock-off', 'throat-chop'], special: ['dark-pulse', 'snarl'], status: ['taunt', 'nasty-plot', 'torment'] },
    steel: { physical: ['iron-head', 'heavy-slam', 'meteor-mash'], special: ['flash-cannon', 'steel-beam'], status: ['iron-defense', 'autotomize', 'metal-sound'] },
    ghost: { physical: ['shadow-claw', 'poltergeist', 'phantom-force'], special: ['shadow-ball', 'hex'], status: ['will-o-wisp', 'destiny-bond', 'curse'] },
    dragon: { physical: ['dragon-claw', 'outrage', 'dual-chop'], special: ['draco-meteor', 'dragon-pulse'], status: ['dragon-dance', 'focus-energy', 'scale-shot'] },
    fairy: { physical: ['play-rough', 'spirit-break'], special: ['moonblast', 'dazzling-gleam'], status: ['misty-terrain', 'charm', 'calm-mind'] },
    normal: { physical: ['body-slam', 'double-edge', 'facade'], special: ['hyper-voice', 'swift', 'tri-attack'], status: ['protect', 'substitute', 'rest'] },
};

const getStat = (pokemon, statName) => pokemon?.stats?.find(s => s.stat.name === statName)?.base_stat || 0;

const getRole = (pokemon) => {
    const attack = getStat(pokemon, 'attack');
    const specialAttack = getStat(pokemon, 'special-attack');
    if (attack > specialAttack + 15) return 'physical';
    if (specialAttack > attack + 15) return 'special';
    return 'balanced';
};

const getMoveSet = (pokemon) => {
    if (!pokemon) return ['[Move 1]', '[Move 2]', '[Move 3]', '[Move 4]'];
    const role = getRole(pokemon);
    const primary = role === 'special' ? 'special' : 'physical';
    const secondary = role === 'physical' ? 'special' : 'physical';
    const types = (pokemon.types || []).map(t => t.type.name);

    const legalMoveIds = new Set((pokemon.moves || []).map(m => m.move?.name).filter(Boolean));
    const picked = [];
    const tryAdd = (moveId) => {
        if (legalMoveIds.has(moveId)) picked.push(moveId);
    };

    types.forEach((type) => {
        const pool = MOVE_POOL[type] || MOVE_POOL.normal;
        pool[primary].forEach(tryAdd);
    });
    types.forEach((type) => {
        const pool = MOVE_POOL[type] || MOVE_POOL.normal;
        pool[secondary].forEach(tryAdd);
    });
    types.forEach((type) => {
        const pool = MOVE_POOL[type] || MOVE_POOL.normal;
        pool.status.forEach(tryAdd);
    });

    const fallback = MOVE_POOL.normal;
    fallback[primary].forEach(tryAdd);
    fallback[secondary].forEach(tryAdd);
    fallback.status.forEach(tryAdd);

    const unique = [...new Set(picked)];
    if (unique.length < 4) {
        for (const moveId of legalMoveIds) {
            if (!unique.includes(moveId)) unique.push(moveId);
            if (unique.length === 4) break;
        }
    }
    return unique.slice(0, 4).map(formatName);
};

export default function ShowdownExport({ team, teamName }) {
    const [copied, setCopied] = useState(false);

    if (!team || team.length === 0) return null;

    const generateShowdownText = () => {
        const sixSlots = Array.from({ length: 6 }, (_, idx) => team[idx] || null);
        return sixSlots.map((pokemon, idx) => {
            const nameCap = pokemon?.name ? formatName(pokemon.name) : `Pokemon ${idx + 1}`;
            const abilityName = pokemon ? getAbilityName(pokemon) : '[ability name]';
            let text = `${nameCap} @ No Item\n`;
            text += `Ability: ${abilityName}\n`;
            text += `Level: 100\n`;
            text += `EVs: 84 HP / 84 Atk / 84 Def / 84 SpA / 84 SpD / 84 Spe\n`;
            text += `Serious Nature\n`;
            const moves = getMoveSet(pokemon);
            moves.forEach((move) => {
                text += `- ${move}\n`;
            });
            text = text.trimEnd();
            return text;
        }).join('\n\n');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateShowdownText());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="showdown-export gba-export-panel">
            <h3 className="gba-export-title">
                <span className="gba-pokeball-dot" aria-hidden="true">◉</span>
                {teamName} Team Export
            </h3>
            <div className="gba-export-label">SHOWDOWN EXPORT DATA</div>
            <div className="gba-export-status">READY FOR IMPORT ✓</div>
            <textarea
                className="gba-export-textarea"
                readOnly
                value={generateShowdownText()}
            />
            <button
                className="primary-btn gba-export-copy-btn"
                onClick={handleCopy}
            >
                {copied ? 'COPIED!' : 'COPY TO SHOWDOWN'}
            </button>
        </div>
    );
}

