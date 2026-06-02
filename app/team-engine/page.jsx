'use client';

import TeamEngine from '../../src/components/TeamEngine';
import { useSystemState } from '../../src/context/SystemStateContext';

export default function TeamEnginePage() {
  const { gymTeam, setGymTeam, setCurrentType } = useSystemState();

  return <TeamEngine gymTeam={gymTeam} setGymTeam={setGymTeam} onTypeGenerated={setCurrentType} />;
}
