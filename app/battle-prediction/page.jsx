'use client';

import PredictionEngine from '../../src/components/PredictionEngine';
import { useSystemState } from '../../src/context/SystemStateContext';

export default function BattlePredictionPage() {
  const { gymTeam, challengerTeam, challengerMeta } = useSystemState();

  return <PredictionEngine gymTeam={gymTeam} challengerTeam={challengerTeam} challengerMeta={challengerMeta} />;
}
