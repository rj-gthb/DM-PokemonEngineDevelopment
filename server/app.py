from flask import Flask, request, jsonify
from flask_cors import CORS
from models.ml_models import (
    cosineModel,
    decisionTreeRank,
    gowerModel,
    kMeansModel,
    knnModel,
    randomForestRank,
    ruleBasedScore,
    select_diverse_team,
)
from models.prediction_models import predictBattle

app = Flask(__name__)
CORS(app) # Allow cross-origin requests from React

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    gym_team = data.get('gymTeam', [])
    challenger_team = data.get('challengerTeam', [])
    model_name = data.get('modelName', 'logisticRegression')
    
    result = predictBattle(gym_team, challenger_team, model_name)
    return jsonify(result)

@app.route('/api/select_team', methods=['POST'])
def select_team():
    data = request.json
    gym_team = data.get('gymTeam', [])
    candidate_pool = data.get('candidatePool', [])
    model_strategy = data.get('modelStrategy', 'randomForest')
    
    final_team = []
    
    if model_strategy == 'kMeans':
        final_team = kMeansModel(candidate_pool, gym_team, 4)
    elif model_strategy == 'knn':
        final_team = knnModel(candidate_pool, gym_team, 8)[:6]
    elif model_strategy == 'cosine':
        final_team = select_diverse_team(cosineModel(candidate_pool, gym_team))
    elif model_strategy == 'gower':
        final_team = select_diverse_team(gowerModel(candidate_pool, gym_team))
    elif model_strategy == 'decisionTree':
        final_team = select_diverse_team(decisionTreeRank(candidate_pool, gym_team))
    elif model_strategy == 'randomForest':
        final_team = select_diverse_team(randomForestRank(candidate_pool, gym_team))
    elif model_strategy == 'ruleBased':
        candidate_pool.sort(key=lambda p: ruleBasedScore(p, gym_team), reverse=True)
        final_team = candidate_pool[:6]
    else:
        # Fallback to diversity + high bst
        used_types = set()
        
        def score_pokemon(poke):
            bst = sum(s['base_stat'] for s in poke.get('stats', []))
            penalty = 0
            for t in poke.get('types', []):
                if t['type']['name'] in used_types:
                    penalty += 40
            return bst - penalty

        candidate_pool.sort(key=score_pokemon, reverse=True)
        for p in candidate_pool:
            if len(final_team) >= 6:
                break
            final_team.append(p)
            for t in p.get('types', []):
                used_types.add(t['type']['name'])
                
    return jsonify({'team': final_team[:6]})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
