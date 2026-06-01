import math
import random

TYPE_CHART = {
    'normal': {'weakTo': ['fighting'], 'resistantTo': [], 'immuneTo': ['ghost']},
    'fire': {'weakTo': ['water', 'ground', 'rock'], 'resistantTo': ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], 'immuneTo': []},
    'water': {'weakTo': ['electric', 'grass'], 'resistantTo': ['fire', 'water', 'ice', 'steel'], 'immuneTo': []},
    'electric': {'weakTo': ['ground'], 'resistantTo': ['electric', 'flying', 'steel'], 'immuneTo': []},
    'grass': {'weakTo': ['fire', 'ice', 'poison', 'flying', 'bug'], 'resistantTo': ['water', 'electric', 'grass', 'ground'], 'immuneTo': []},
    'ice': {'weakTo': ['fire', 'fighting', 'rock', 'steel'], 'resistantTo': ['ice'], 'immuneTo': []},
    'fighting': {'weakTo': ['flying', 'psychic', 'fairy'], 'resistantTo': ['bug', 'rock', 'dark'], 'immuneTo': []},
    'poison': {'weakTo': ['ground', 'psychic'], 'resistantTo': ['grass', 'fighting', 'poison', 'bug', 'fairy'], 'immuneTo': []},
    'ground': {'weakTo': ['water', 'grass', 'ice'], 'resistantTo': ['poison', 'rock'], 'immuneTo': ['electric']},
    'flying': {'weakTo': ['electric', 'ice', 'rock'], 'resistantTo': ['grass', 'fighting', 'bug'], 'immuneTo': ['ground']},
    'psychic': {'weakTo': ['bug', 'ghost', 'dark'], 'resistantTo': ['fighting', 'psychic'], 'immuneTo': []},
    'bug': {'weakTo': ['fire', 'flying', 'rock'], 'resistantTo': ['grass', 'fighting', 'ground'], 'immuneTo': []},
    'rock': {'weakTo': ['water', 'grass', 'fighting', 'ground', 'steel'], 'resistantTo': ['normal', 'fire', 'poison', 'flying'], 'immuneTo': []},
    'ghost': {'weakTo': ['ghost', 'dark'], 'resistantTo': ['poison', 'bug'], 'immuneTo': ['normal', 'fighting']},
    'dragon': {'weakTo': ['ice', 'dragon', 'fairy'], 'resistantTo': ['fire', 'water', 'electric', 'grass'], 'immuneTo': []},
    'dark': {'weakTo': ['fighting', 'bug', 'fairy'], 'resistantTo': ['ghost', 'dark'], 'immuneTo': ['psychic']},
    'steel': {'weakTo': ['fire', 'fighting', 'ground'], 'resistantTo': ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], 'immuneTo': ['poison']},
    'fairy': {'weakTo': ['poison', 'steel'], 'resistantTo': ['fighting', 'bug', 'dark'], 'immuneTo': ['dragon']}
}

STAT_NAMES = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
ALL_TYPES = list(TYPE_CHART.keys())


def get_types(pokemon):
    return [t['type']['name'] for t in pokemon.get('types', [])]


def get_stats(pokemon):
    stats_by_name = {s['stat']['name']: s.get('base_stat', 0) for s in pokemon.get('stats', [])}
    return [stats_by_name.get(name, 0) for name in STAT_NAMES]


def get_bst(pokemon):
    return sum(get_stats(pokemon))


def get_region_bucket(pokemon):
    poke_id = pokemon.get('id', 0)
    if poke_id <= 151:
        return 1
    if poke_id <= 251:
        return 2
    if poke_id <= 386:
        return 3
    if poke_id <= 493:
        return 4
    if poke_id <= 649:
        return 5
    if poke_id <= 721:
        return 6
    if poke_id <= 809:
        return 7
    return 8


def get_effectiveness(attack_type, defend_types):
    multiplier = 1
    for d_type in defend_types:
        defense = TYPE_CHART.get(d_type)
        if defense:
            if attack_type in defense['weakTo']:
                multiplier *= 2
            if attack_type in defense['resistantTo']:
                multiplier *= 0.5
            if attack_type in defense['immuneTo']:
                multiplier *= 0
    return multiplier


def matchup_score(candidate, opponent_team):
    cand_types = get_types(candidate)
    score = 0

    for opponent in opponent_team:
        opp_types = get_types(opponent)
        best_offense = max([get_effectiveness(t, opp_types) for t in cand_types] or [1])
        worst_defense = max([get_effectiveness(t, cand_types) for t in opp_types] or [1])

        if best_offense >= 4:
            score += 36
        elif best_offense > 1:
            score += 22
        elif best_offense == 0:
            score -= 12

        if worst_defense == 0:
            score += 24
        elif worst_defense < 1:
            score += 14
        elif worst_defense >= 4:
            score -= 32
        elif worst_defense > 1:
            score -= 18

    return score


def diversity_bonus(candidate, selected_team):
    used_types = {t for pokemon in selected_team for t in get_types(pokemon)}
    duplicate_types = sum(1 for t in get_types(candidate) if t in used_types)
    return -18 * duplicate_types


def ruleBasedScore(candidate, gym_team):
    if not gym_team:
        return get_bst(candidate) / 10

    stats = get_stats(candidate)
    bst = sum(stats)
    speed = stats[5]
    attacking_power = max(stats[1], stats[3])
    bulk = stats[0] + stats[2] + stats[4]

    return (
        matchup_score(candidate, gym_team)
        + (bst * 0.11)
        + (speed * 0.08)
        + (attacking_power * 0.07)
        + (bulk * 0.025)
    )


def cosine_similarity(stats_a, stats_b):
    dot_product = sum(a * b for a, b in zip(stats_a, stats_b))
    norm_a = math.sqrt(sum(a * a for a in stats_a))
    norm_b = math.sqrt(sum(b * b for b in stats_b))
    if norm_a == 0 or norm_b == 0:
        return 0
    return dot_product / (norm_a * norm_b)


def average_stat_profile(team):
    if not team:
        return [90, 90, 90, 90, 90, 90]
    return [sum(get_stats(p)[i] for p in team) / len(team) for i in range(len(STAT_NAMES))]


def cosineModel(pool, gym_team):
    gym_profile = average_stat_profile(gym_team)
    target_profile = [
        max(80, 160 - gym_profile[0] * 0.45),
        max(80, 170 - gym_profile[2] * 0.45),
        max(80, 160 - gym_profile[1] * 0.35),
        max(80, 170 - gym_profile[4] * 0.45),
        max(80, 160 - gym_profile[3] * 0.35),
        max(80, gym_profile[5] + 18),
    ]

    ranked = [
        {
            'candidate': candidate,
            'score': cosine_similarity(get_stats(candidate), target_profile) * 100 + ruleBasedScore(candidate, gym_team)
        }
        for candidate in pool
    ]
    ranked.sort(key=lambda item: item['score'], reverse=True)
    return ranked


def gowers_similarity(poke_a, poke_b):
    stat_distance = sum(abs(a - b) / 255 for a, b in zip(get_stats(poke_a), get_stats(poke_b))) / len(STAT_NAMES)

    types_a = set(get_types(poke_a))
    types_b = set(get_types(poke_b))
    type_distance = 1 - (len(types_a & types_b) / len(types_a | types_b)) if types_a or types_b else 0

    region_distance = abs(get_region_bucket(poke_a) - get_region_bucket(poke_b)) / 8

    return 1 - ((stat_distance * 0.55) + (type_distance * 0.35) + (region_distance * 0.10))


def gowerModel(pool, gym_team):
    ranked = []
    for candidate in pool:
        if gym_team:
            similarity_to_gym = sum(gowers_similarity(candidate, p) for p in gym_team) / len(gym_team)
        else:
            similarity_to_gym = 0.5
        counter_value = ruleBasedScore(candidate, gym_team)
        ranked.append({
            'candidate': candidate,
            'score': counter_value + ((1 - similarity_to_gym) * 35) + (get_bst(candidate) * 0.04)
        })

    ranked.sort(key=lambda item: item['score'], reverse=True)
    return ranked


def classifyRole(candidate):
    hp, atk, defense, spa, spd, spe = get_stats(candidate)
    physical_power = atk - spa
    special_power = spa - atk
    bulk = hp + defense + spd

    if spe >= 105 and max(atk, spa) >= 95:
        return 'Sweeper'
    if physical_power >= 25 and atk >= 95:
        return 'Physical Attacker'
    if special_power >= 25 and spa >= 95:
        return 'Special Attacker'
    if bulk >= 285 and max(defense, spd) >= 95:
        return 'Wall'
    if hp >= 90 and max(atk, spa) >= 85:
        return 'Bulky Pivot'
    return 'Support'


def decisionTreeRank(pool, gym_team):
    role_weights = {
        'Sweeper': 28,
        'Physical Attacker': 22,
        'Special Attacker': 22,
        'Wall': 18,
        'Bulky Pivot': 16,
        'Support': 8,
    }
    ranked = []
    for candidate in pool:
        role = classifyRole(candidate)
        ranked.append({
            'candidate': candidate,
            'score': ruleBasedScore(candidate, gym_team) + role_weights[role] + get_bst(candidate) * 0.035,
            'role': role
        })

    ranked.sort(key=lambda item: item['score'], reverse=True)
    return ranked


def knnModel(pool, gym_team, k=8):
    if not gym_team:
        return pool[:6]

    role_prototypes = [
        [85, 125, 80, 70, 80, 115],
        [85, 70, 80, 125, 80, 115],
        [105, 90, 120, 70, 110, 45],
        [75, 105, 85, 105, 85, 95],
    ]

    ranked = []
    for candidate in pool:
        stats = get_stats(candidate)
        nearest_role = max(cosine_similarity(stats, prototype) for prototype in role_prototypes)
        ranked.append({
            'candidate': candidate,
            'score': nearest_role * 55 + ruleBasedScore(candidate, gym_team) + get_bst(candidate) * 0.03
        })

    ranked.sort(key=lambda item: item['score'], reverse=True)
    return [item['candidate'] for item in ranked[:max(k, 6)]]


def kMeansModel(pool, gym_team, k=4):
    if len(pool) <= 6:
        return pool

    vectors = [get_stats(candidate) for candidate in pool]
    centroids = vectors[:k]

    for _ in range(8):
        clusters = [[] for _ in range(k)]
        for index, vector in enumerate(vectors):
            nearest = min(range(k), key=lambda c: euclidean_distance(vector, centroids[c]))
            clusters[nearest].append(index)

        for cluster_index, members in enumerate(clusters):
            if members:
                centroids[cluster_index] = [
                    sum(vectors[member][stat_index] for member in members) / len(members)
                    for stat_index in range(len(STAT_NAMES))
                ]

    selected = []
    clusters = [[] for _ in range(k)]
    for index, vector in enumerate(vectors):
        nearest = min(range(k), key=lambda c: euclidean_distance(vector, centroids[c]))
        clusters[nearest].append(pool[index])

    while len(selected) < 6 and any(clusters):
        for cluster in clusters:
            if not cluster or len(selected) >= 6:
                continue
            cluster.sort(
                key=lambda candidate: ruleBasedScore(candidate, gym_team) + diversity_bonus(candidate, selected),
                reverse=True
            )
            selected.append(cluster.pop(0))

    return selected


def euclidean_distance(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def randomForestRank(pool, gym_team):
    random.seed(42)
    scored = []
    trees = [
        {'type': 1.25, 'bst': 0.09, 'speed': 0.08, 'bulk': 0.02, 'power': 0.04},
        {'type': 0.95, 'bst': 0.12, 'speed': 0.04, 'bulk': 0.04, 'power': 0.05},
        {'type': 1.45, 'bst': 0.06, 'speed': 0.10, 'bulk': 0.015, 'power': 0.07},
        {'type': 1.10, 'bst': 0.08, 'speed': 0.03, 'bulk': 0.06, 'power': 0.04},
        {'type': 0.85, 'bst': 0.14, 'speed': 0.07, 'bulk': 0.03, 'power': 0.03},
    ]

    for candidate in pool:
        hp, atk, defense, spa, spd, spe = get_stats(candidate)
        bst = hp + atk + defense + spa + spd + spe
        bulk = hp + defense + spd
        power = max(atk, spa)
        type_score = matchup_score(candidate, gym_team)

        tree_scores = [
            type_score * tree['type']
            + bst * tree['bst']
            + spe * tree['speed']
            + bulk * tree['bulk']
            + power * tree['power']
            for tree in trees
        ]
        scored.append({'candidate': candidate, 'score': sum(tree_scores) / len(tree_scores)})

    scored.sort(key=lambda item: item['score'], reverse=True)
    return scored


def select_diverse_team(ranked_items, size=6):
    selected = []
    for item in ranked_items:
        candidate = item['candidate']
        adjusted_score = item['score'] + diversity_bonus(candidate, selected)
        item['_adjustedScore'] = adjusted_score

    remaining = ranked_items[:]
    while len(selected) < size and remaining:
        remaining.sort(key=lambda item: item['_adjustedScore'], reverse=True)
        best = remaining.pop(0)
        selected.append(best['candidate'])
        for item in remaining:
            item['_adjustedScore'] = item['score'] + diversity_bonus(item['candidate'], selected)

    return selected
