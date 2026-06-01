'use client';

import ChallengerEngine from '../../src/components/ChallengerEngine';
import { useSystemState } from '../../src/context/SystemStateContext';

export default function ChallengerEnginePage() {
  const { gymTeam, challengerTeam, setChallengerTeam, setChallengerMeta, setCurrentType } = useSystemState();

  return (
    <ChallengerEngine
      gymTeam={gymTeam}
      challengerTeam={challengerTeam}
      setChallengerTeam={setChallengerTeam}
      setChallengerMeta={setChallengerMeta}
      onTypeChange={setCurrentType}
    />
  );
}
