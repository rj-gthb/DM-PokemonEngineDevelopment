import math
import random
from models.ml_models import ruleBasedScore

def logisticRegressionPredict(gym_team, challenger_team):
    gym_score = 0
    chal_score = 0
    
    for p in gym_team:
        gym_score += ruleBasedScore(p, challenger_team)
    for p in challenger_team:
        chal_score += ruleBasedScore(p, gym_team)
        
    gym_bst = sum(sum(s['base_stat'] for s in p.get('stats', [])) for p in gym_team)
    chal_bst = sum(sum(s['base_stat'] for s in p.get('stats', [])) for p in challenger_team)
    
    gym_score += (gym_bst / 10)
    chal_score += (chal_bst / 10)
    
    diff = chal_score - gym_score
    k = 0.005
    p_challenger_wins = 1 / (1 + math.exp(-k * diff))
    
    if p_challenger_wins > 0.5:
        return {
            'predictedWinner': 'challenger',
            'confidence': p_challenger_wins,
            'reason': f"Logistic regression calculated a {round(p_challenger_wins * 100)}% probability for the Challenger based on stat differentials and type advantages."
        }
    else:
        return {
            'predictedWinner': 'gym',
            'confidence': 1 - p_challenger_wins,
            'reason': f"Logistic regression calculated a {round((1 - p_challenger_wins) * 100)}% probability for the Gym Leader due to superior synergy."
        }

def randomForestPredict(gym_team, challenger_team):
    chal_wins = 0
    iterations = 100
    
    for _ in range(iterations):
        gym_score = 0
        chal_score = 0
        
        type_weight = random.random() * 2
        stat_weight = random.random() * 2
        speed_weight = random.random() * 2
        
        # Base stats
        for p in gym_team:
            bst = sum(s['base_stat'] for s in p.get('stats', []))
            spe = next((s['base_stat'] for s in p.get('stats', []) if s['stat']['name'] == 'speed'), 0)
            gym_score += (bst * stat_weight) + (spe * speed_weight)
            
        for p in challenger_team:
            bst = sum(s['base_stat'] for s in p.get('stats', []))
            spe = next((s['base_stat'] for s in p.get('stats', []) if s['stat']['name'] == 'speed'), 0)
            chal_score += (bst * stat_weight) + (spe * speed_weight)
            
        # Types
        for p in gym_team:
            gym_score += ruleBasedScore(p, challenger_team) * type_weight * 10
        for p in challenger_team:
            chal_score += ruleBasedScore(p, gym_team) * type_weight * 10
            
        if chal_score > gym_score:
            chal_wins += 1
            
    confidence = chal_wins / iterations
    
    if confidence > 0.5:
        return {
            'predictedWinner': 'challenger',
            'confidence': confidence,
            'reason': f"Random Forest ensemble predicted Challenger wins in {round(confidence * 100)}% of 100 simulated matchups."
        }
    else:
        return {
            'predictedWinner': 'gym',
            'confidence': 1 - confidence,
            'reason': f"Random Forest ensemble predicted Gym Leader wins in {round((1 - confidence) * 100)}% of 100 simulated matchups."
        }

def naiveBayesPredict(gym_team, challenger_team):
    def getAvg(team, stat_name):
        if not team: return 0
        return sum(next((s['base_stat'] for s in p.get('stats', []) if s['stat']['name'] == stat_name), 0) for p in team) / len(team)
        
    chal_probs = []
    
    c_spe = getAvg(challenger_team, 'speed')
    g_spe = getAvg(gym_team, 'speed')
    chal_probs.append(0.6 if c_spe > g_spe else 0.4)
    
    c_bulk = getAvg(challenger_team, 'hp') + getAvg(challenger_team, 'defense')
    g_bulk = getAvg(gym_team, 'hp') + getAvg(gym_team, 'defense')
    chal_probs.append(0.55 if c_bulk > g_bulk else 0.45)
    
    c_atk = getAvg(challenger_team, 'attack') + getAvg(challenger_team, 'special-attack')
    g_atk = getAvg(gym_team, 'attack') + getAvg(gym_team, 'special-attack')
    chal_probs.append(0.6 if c_atk > g_atk else 0.4)
    
    combined_p = 1
    for p in chal_probs: combined_p *= p
    
    combined_not_p = 1
    for p in chal_probs: combined_not_p *= (1 - p)
    
    final_chal_prob = combined_p / (combined_p + combined_not_p) if (combined_p + combined_not_p) > 0 else 0
    
    if final_chal_prob > 0.5:
        return {
            'predictedWinner': 'challenger',
            'confidence': final_chal_prob,
            'reason': f"Naive Bayes model calculated a {round(final_chal_prob * 100)}% probability for Challenger based on independent speed, bulk, and power factors."
        }
    else:
        return {
            'predictedWinner': 'gym',
            'confidence': 1 - final_chal_prob,
            'reason': f"Naive Bayes model calculated a {round((1 - final_chal_prob) * 100)}% probability for Gym Leader."
        }

def predictBattle(gym_team, challenger_team, model_name):
    if not gym_team or not challenger_team: return None
    
    if model_name == 'randomForest':
        return randomForestPredict(gym_team, challenger_team)
    elif model_name == 'naiveBayes':
        return naiveBayesPredict(gym_team, challenger_team)
    else:
        return logisticRegressionPredict(gym_team, challenger_team)
