import { NextResponse } from 'next/server';
import { ruleBasedScore } from '../../../src/utils/mlModels';

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ||
  '';

function scoreCandidate(candidate, gymTeam, modelStrategy) {
  const bst = candidate.stats?.reduce((sum, stat) => sum + (stat.base_stat || 0), 0) || 0;
  const ruleScore = ruleBasedScore(candidate, gymTeam);

  switch (modelStrategy) {
    case 'ruleBased':
      return ruleScore;
    case 'decisionTree':
    case 'knn':
    case 'cosine':
    case 'gower':
    case 'randomForest':
      return ruleScore + bst / 10;
    case 'diversity':
      return ruleScore * 0.7 + bst / 20 + (candidate.types?.length || 0) * 15;
    default:
      return ruleScore + bst / 20;
  }
}

function localSelectTeam(candidatePool, gymTeam, modelStrategy) {
  const sortedPool = [...candidatePool].sort(
    (a, b) => scoreCandidate(b, gymTeam, modelStrategy) - scoreCandidate(a, gymTeam, modelStrategy)
  );
  return sortedPool.slice(0, 6);
}

export async function POST(request) {
  const body = await request.json();
  const candidatePool = body.candidatePool || [];
  const gymTeam = body.gymTeam || [];
  const modelStrategy = body.modelStrategy || 'randomForest';

  if (!BACKEND_API_BASE_URL) {
    return NextResponse.json({ team: localSelectTeam(candidatePool, gymTeam, modelStrategy) });
  }

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/api/select_team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || `Backend returned status ${response.status}`);
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const fallbackTeam = localSelectTeam(candidatePool, gymTeam, modelStrategy);
    return NextResponse.json(
      {
        team: fallbackTeam,
        warning: `Backend request failed: ${error?.message || 'unknown error'}. Falling back to local selection.`,
      },
      { status: 200 }
    );
  }
}
