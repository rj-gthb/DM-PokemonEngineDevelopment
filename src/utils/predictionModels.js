import { ruleBasedScore } from './mlModels';

/**
 * Logistic Regression Simulator
 * Simulates a logistic regression curve based on score differential
 */
function logisticRegressionPredict(gymTeam, challengerTeam) {
    let gymScore = 0;
    let chalScore = 0;
    
    // Evaluate cross scores
    gymTeam.forEach(p => gymScore += ruleBasedScore(p, challengerTeam));
    challengerTeam.forEach(p => chalScore += ruleBasedScore(p, gymTeam));
    
    // Add BST factor
    const gymBst = gymTeam.reduce((sum, p) => sum + p.stats.reduce((s, st) => s + st.base_stat, 0), 0);
    const chalBst = challengerTeam.reduce((sum, p) => sum + p.stats.reduce((s, st) => s + st.base_stat, 0), 0);
    
    gymScore += (gymBst / 10);
    chalScore += (chalBst / 10);
    
    const diff = chalScore - gymScore; // positive means challenger is better
    
    // Logistic function: P = 1 / (1 + e^(-k * diff))
    // Scale k down so we don't always get 100% or 0%
    const k = 0.005; 
    const pChallengerWins = 1 / (1 + Math.exp(-k * diff));
    
    if (pChallengerWins > 0.5) {
        return {
            predictedWinner: 'challenger',
            confidence: pChallengerWins,
            reason: `Logistic regression calculated a ${Math.round(pChallengerWins * 100)}% probability for the Challenger based on stat differentials and type advantages.`
        };
    } else {
        return {
            predictedWinner: 'gym',
            confidence: 1 - pChallengerWins,
            reason: `Logistic regression calculated a ${Math.round((1 - pChallengerWins) * 100)}% probability for the Gym Leader due to superior synergy.`
        };
    }
}

/**
 * Random Forest Predictor
 * Simulates multiple decision trees with random stat/type weights
 */
function randomForestPredict(gymTeam, challengerTeam) {
    let chalWins = 0;
    const iterations = 100;
    
    for (let i = 0; i < iterations; i++) {
        let gymScore = 0;
        let chalScore = 0;
        
        const typeWeight = Math.random() * 2;
        const statWeight = Math.random() * 2;
        const speedWeight = Math.random() * 2;
        
        // Base stats
        gymTeam.forEach(p => {
            const bst = p.stats.reduce((s, st) => s + st.base_stat, 0);
            const spe = p.stats.find(st => st.stat.name === 'speed')?.base_stat || 0;
            gymScore += (bst * statWeight) + (spe * speedWeight);
        });
        
        challengerTeam.forEach(p => {
            const bst = p.stats.reduce((s, st) => s + st.base_stat, 0);
            const spe = p.stats.find(st => st.stat.name === 'speed')?.base_stat || 0;
            chalScore += (bst * statWeight) + (spe * speedWeight);
        });
        
        // Types
        gymTeam.forEach(p => gymScore += ruleBasedScore(p, challengerTeam) * typeWeight * 10);
        challengerTeam.forEach(p => chalScore += ruleBasedScore(p, gymTeam) * typeWeight * 10);
        
        if (chalScore > gymScore) chalWins++;
    }
    
    const confidence = chalWins / iterations;
    
    if (confidence > 0.5) {
        return {
            predictedWinner: 'challenger',
            confidence: confidence,
            reason: `Random Forest ensemble predicted Challenger wins in ${Math.round(confidence * 100)}% of 100 simulated matchups.`
        };
    } else {
        return {
            predictedWinner: 'gym',
            confidence: 1 - confidence,
            reason: `Random Forest ensemble predicted Gym Leader wins in ${Math.round((1 - confidence) * 100)}% of 100 simulated matchups.`
        };
    }
}

/**
 * Naive Bayes Predictor
 * Simulates basic probability based on historical feature distribution
 */
function naiveBayesPredict(gymTeam, challengerTeam) {
    // In a real Naive Bayes, we'd have P(Win | Features).
    // We will simulate it by calculating independent "feature win rates"
    
    const getAvg = (team, stat) => team.reduce((s, p) => s + (p.stats.find(st => st.stat.name === stat)?.base_stat || 0), 0) / team.length;
    
    let chalProbs = [];
    
    // Speed feature
    const cSpe = getAvg(challengerTeam, 'speed');
    const gSpe = getAvg(gymTeam, 'speed');
    chalProbs.push(cSpe > gSpe ? 0.6 : 0.4);
    
    // Bulk feature
    const cBulk = getAvg(challengerTeam, 'hp') + getAvg(challengerTeam, 'defense');
    const gBulk = getAvg(gymTeam, 'hp') + getAvg(gymTeam, 'defense');
    chalProbs.push(cBulk > gBulk ? 0.55 : 0.45);
    
    // Power feature
    const cAtk = getAvg(challengerTeam, 'attack') + getAvg(challengerTeam, 'special-attack');
    const gAtk = getAvg(gymTeam, 'attack') + getAvg(gymTeam, 'special-attack');
    chalProbs.push(cAtk > gAtk ? 0.6 : 0.4);
    
    // Aggregate probs (pseudo Naive Bayes)
    const combinedP = chalProbs.reduce((acc, p) => acc * p, 1);
    const combinedNotP = chalProbs.reduce((acc, p) => acc * (1 - p), 1);
    const finalChalProb = combinedP / (combinedP + combinedNotP);
    
    if (finalChalProb > 0.5) {
        return {
            predictedWinner: 'challenger',
            confidence: finalChalProb,
            reason: `Naive Bayes model calculated a ${Math.round(finalChalProb * 100)}% probability for Challenger based on independent speed, bulk, and power factors.`
        };
    } else {
        return {
            predictedWinner: 'gym',
            confidence: 1 - finalChalProb,
            reason: `Naive Bayes model calculated a ${Math.round((1 - finalChalProb) * 100)}% probability for Gym Leader.`
        };
    }
}

export function predictBattle(gymTeam, challengerTeam, modelName) {
    if (gymTeam.length === 0 || challengerTeam.length === 0) return null;
    
    switch (modelName) {
        case 'randomForest':
            return randomForestPredict(gymTeam, challengerTeam);
        case 'naiveBayes':
            return naiveBayesPredict(gymTeam, challengerTeam);
        case 'logisticRegression':
        default:
            return logisticRegressionPredict(gymTeam, challengerTeam);
    }
}
