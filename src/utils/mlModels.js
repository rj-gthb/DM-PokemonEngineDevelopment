export const TYPE_CHART = {
    normal: { weakTo: ['fighting'], resistantTo: [], immuneTo: ['ghost'] },
    fire: { weakTo: ['water', 'ground', 'rock'], resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immuneTo: [] },
    water: { weakTo: ['electric', 'grass'], resistantTo: ['fire', 'water', 'ice', 'steel'], immuneTo: [] },
    electric: { weakTo: ['ground'], resistantTo: ['electric', 'flying', 'steel'], immuneTo: [] },
    grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resistantTo: ['water', 'electric', 'grass', 'ground'], immuneTo: [] },
    ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'], resistantTo: ['ice'], immuneTo: [] },
    fighting: { weakTo: ['flying', 'psychic', 'fairy'], resistantTo: ['bug', 'rock', 'dark'], immuneTo: [] },
    poison: { weakTo: ['ground', 'psychic'], resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immuneTo: [] },
    ground: { weakTo: ['water', 'grass', 'ice'], resistantTo: ['poison', 'rock'], immuneTo: ['electric'] },
    flying: { weakTo: ['electric', 'ice', 'rock'], resistantTo: ['grass', 'fighting', 'bug'], immuneTo: ['ground'] },
    psychic: { weakTo: ['bug', 'ghost', 'dark'], resistantTo: ['fighting', 'psychic'], immuneTo: [] },
    bug: { weakTo: ['fire', 'flying', 'rock'], resistantTo: ['grass', 'fighting', 'ground'], immuneTo: [] },
    rock: { weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'], resistantTo: ['normal', 'fire', 'poison', 'flying'], immuneTo: [] },
    ghost: { weakTo: ['ghost', 'dark'], resistantTo: ['poison', 'bug'], immuneTo: ['normal', 'fighting'] },
    dragon: { weakTo: ['ice', 'dragon', 'fairy'], resistantTo: ['fire', 'water', 'electric', 'grass'], immuneTo: [] },
    dark: { weakTo: ['fighting', 'bug', 'fairy'], resistantTo: ['ghost', 'dark'], immuneTo: ['psychic'] },
    steel: { weakTo: ['fire', 'fighting', 'ground'], resistantTo: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immuneTo: ['poison'] },
    fairy: { weakTo: ['poison', 'steel'], resistantTo: ['fighting', 'bug', 'dark'], immuneTo: ['dragon'] }
};

const getEffectiveness = (attackType, defendTypes) => {
    let multiplier = 1;
    for (const dType of defendTypes) {
        const def = TYPE_CHART[dType];
        if (def) {
            if (def.weakTo.includes(attackType)) multiplier *= 2;
            if (def.resistantTo.includes(attackType)) multiplier *= 0.5;
            if (def.immuneTo.includes(attackType)) multiplier *= 0;
        }
    }
    return multiplier;
};

// 1. Rule-Based Scoring
export function ruleBasedScore(candidate, gymTeam) {
    if (!gymTeam || gymTeam.length === 0) return 0;
    
    let score = 0;
    const candTypes = candidate.types.map(t => t.type.name);
    
    gymTeam.forEach(gymPoke => {
        const gymTypes = gymPoke.types.map(t => t.type.name);
        
        // Offensive check: Can candidate hit gymPoke for super effective?
        let maxOffense = 1;
        candTypes.forEach(cT => {
            const eff = getEffectiveness(cT, gymTypes);
            if (eff > maxOffense) maxOffense = eff;
        });
        if (maxOffense > 1) score += 50;

        // Defensive check: Can gymPoke hit candidate for super effective?
        let maxDefense = 1;
        gymTypes.forEach(gT => {
            const eff = getEffectiveness(gT, candTypes);
            if (eff > maxDefense) maxDefense = eff;
        });
        if (maxDefense < 1) score += 30; // Resists
        if (maxDefense > 1) score -= 40; // Weak
    });

    const bst = candidate.stats.reduce((sum, s) => sum + s.base_stat, 0);
    return score + (bst / 10);
}

// 2. Cosine Similarity (Comparing stat profiles)
export function cosineSimilarity(statsA, statsB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < statsA.length; i++) {
        dotProduct += statsA[i] * statsB[i];
        normA += statsA[i] * statsA[i];
        normB += statsB[i] * statsB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 3. Gower's Distance (Mixed features: types + stats)
export function gowersDistance(pokeA, pokeB) {
    const statsA = pokeA.stats.map(s => s.base_stat);
    const statsB = pokeB.stats.map(s => s.base_stat);
    
    // Normalize stat difference
    let statDiff = 0;
    for (let i = 0; i < statsA.length; i++) {
        statDiff += Math.abs(statsA[i] - statsB[i]) / 255; // 255 is max base stat
    }
    const statSim = 1 - (statDiff / statsA.length);

    // Jaccard similarity for types
    const typesA = pokeA.types.map(t => t.type.name);
    const typesB = pokeB.types.map(t => t.type.name);
    const intersection = typesA.filter(t => typesB.includes(t));
    const union = [...new Set([...typesA, ...typesB])];
    const typeSim = intersection.length / union.length;

    return (statSim + typeSim) / 2; // Returns similarity (1 - distance)
}

// 4. K-NN
export function knnModel(pool, gymTeam, k = 5) {
    if (!gymTeam || gymTeam.length === 0) return pool.slice(0, 6);
    
    // We want to find pokemon that have high stats and good typing against gym
    // We create a "perfect counter" profile:
    // Extremely high offenses and defenses
    const idealProfile = [120, 120, 120, 120, 120, 120];
    
    const scoredPool = pool.map(candidate => {
        const cStats = candidate.stats.map(s => s.base_stat);
        const sim = cosineSimilarity(cStats, idealProfile);
        const rbScore = ruleBasedScore(candidate, gymTeam);
        return { candidate, score: sim * 100 + rbScore };
    });

    scoredPool.sort((a, b) => b.score - a.score);
    return scoredPool.slice(0, Math.max(k, 6)).map(item => item.candidate);
}

// 5. Decision Tree (Classification)
export function decisionTreeScore(candidate, gymTeam) {
    const score = ruleBasedScore(candidate, gymTeam);
    const bst = candidate.stats.reduce((sum, s) => sum + s.base_stat, 0);

    // Branch 1: BST
    if (bst > 500) {
        // Branch 2: Matchup
        if (score > 100) return 'Strong';
        if (score > 50) return 'Neutral';
        return 'Weak';
    } else {
        if (score > 150) return 'Strong'; // Needs massive type advantage to carry low stats
        if (score > 80) return 'Neutral';
        return 'Weak';
    }
}

// 6. Random Forest (Ensemble)
export function randomForestRank(pool, gymTeam) {
    const scored = pool.map(candidate => {
        let totalScore = 0;
        const iterations = 5;
        // Simulate "trees" by varying weights of stats/types randomly
        for (let i = 0; i < iterations; i++) {
            const rbScore = ruleBasedScore(candidate, gymTeam);
            const bst = candidate.stats.reduce((sum, s) => sum + s.base_stat, 0);
            
            const typeWeight = Math.random() * 2;
            const statWeight = Math.random() * 2;
            
            totalScore += (rbScore * typeWeight) + ((bst/10) * statWeight);
        }
        return { candidate, score: totalScore / iterations };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored;
}
