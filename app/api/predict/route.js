import { NextResponse } from 'next/server';
import { predictBattle } from '../../../src/utils/predictionModels';

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ||
  '';

export async function POST(request) {
  const body = await request.json();
  const gymTeam = body.gymTeam || [];
  const challengerTeam = body.challengerTeam || [];
  const modelName = body.modelName || 'logisticRegression';

  if (!BACKEND_API_BASE_URL) {
    return NextResponse.json(predictBattle(gymTeam, challengerTeam, modelName));
  }

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/api/predict`, {
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
    return NextResponse.json(
      {
        ...predictBattle(gymTeam, challengerTeam, modelName),
        warning: `Backend request failed: ${error?.message || 'unknown error'}. Using local prediction instead.`,
      },
      { status: 200 }
    );
  }
}
