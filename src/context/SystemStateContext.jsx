'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const SystemStateContext = createContext(null);

export function SystemStateProvider({ children }) {
  const [currentType, setCurrentType] = useState('');
  const [gymTeam, setGymTeam] = useState([]);
  const [challengerTeam, setChallengerTeam] = useState([]);
  const [challengerMeta, setChallengerMeta] = useState({ model: 'none', avgScore: 0 });

  const value = useMemo(() => ({
    currentType,
    setCurrentType,
    gymTeam,
    setGymTeam,
    challengerTeam,
    setChallengerTeam,
    challengerMeta,
    setChallengerMeta,
  }), [currentType, gymTeam, challengerTeam, challengerMeta]);

  return <SystemStateContext.Provider value={value}>{children}</SystemStateContext.Provider>;
}

export function useSystemState() {
  const ctx = useContext(SystemStateContext);
  if (!ctx) throw new Error('useSystemState must be used within SystemStateProvider');
  return ctx;
}
