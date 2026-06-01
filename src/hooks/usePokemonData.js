'use client';

import { useState, useEffect } from 'react';

// Specific regions assigned to this section: 3ISA = Hoenn, Sinnoh, Galar.
export const REGIONS = {
    hoenn: { label: 'Hoenn', generation: 3, start: 252, end: 386 },
    sinnoh: { label: 'Sinnoh', generation: 4, start: 387, end: 493 },
    galar: { label: 'Galar', generation: 8, start: 810, end: 898 }
};

// Comprehensive list of Legendaries, Mythicals, and Ultra Beasts up to Gen 8
export const LEGENDARIES = [
    144, 145, 146, 150, 151, // Kanto
    243, 244, 245, 249, 250, 251, // Johto
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386, // Hoenn
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, // Sinnoh
    638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, // Unova
    716, 717, 718, 719, 720, 721, // Kalos
    785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, // Alola (Includes UBs)
    888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898 // Galar
];

export const TYPE_SPECIALIZATIONS = [
    'water',
    'grass',
    'fighting',
    'psychic',
    'dark',
    'steel',
];

export function getNativeRegion(pokemonId) {
    const match = Object.values(REGIONS).find(region => pokemonId >= region.start && pokemonId <= region.end);
    return match?.label || 'Outside Assigned Pool';
}

export function isRestrictedPokemon(pokemon) {
    const name = pokemon.name || '';
    const restrictedForm = name.includes('-mega') || name.includes('-gmax') || name.includes('-primal');
    return LEGENDARIES.includes(pokemon.id) || restrictedForm;
}

let globalCache = []; // module level cache to prevent refetching across components

export function usePokemonData() {
    const [cache, setCache] = useState(globalCache);
    const [loading, setLoading] = useState(globalCache.length === 0);

    useEffect(() => {
        if (globalCache.length > 0) return;

        async function fetchBaseData() {
            try {
                // Fetch up to 898 to include Galar (Gen 8)
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898');
                const data = await response.json();
                
                // Strict Filtering of names to enforce Battle Restrictions
                let formatted = data.results.map((p, index) => ({
                    id: index + 1,
                    name: p.name,
                    url: p.url
                })).filter(p => !isRestrictedPokemon(p));

                // Only keep pokemon that belong to our assigned regions
                formatted = formatted.filter(p => {
                    return (p.id >= REGIONS.hoenn.start && p.id <= REGIONS.hoenn.end) ||
                           (p.id >= REGIONS.sinnoh.start && p.id <= REGIONS.sinnoh.end) ||
                           (p.id >= REGIONS.galar.start && p.id <= REGIONS.galar.end);
                });

                globalCache = formatted;
                setCache(formatted);
            } catch (error) {
                console.error("Failed to load base pokemon data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBaseData();
    }, []);

    const fetchDetails = async (idOrName) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
        return await res.json();
    };

    return { cache, loading, fetchDetails };
}

