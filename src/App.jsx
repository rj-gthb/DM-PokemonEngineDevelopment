import React, { useState } from 'react';
import TeamEngine from './components/TeamEngine';
import ChallengerEngine from './components/ChallengerEngine';
import PredictionEngine from './components/PredictionEngine';
import TypeBackground from './components/TypeBackground';

function App() {
  const [activeTab, setActiveTab] = useState('team');
  const [currentType, setCurrentType] = useState('');
  
  // Lifted state for teams so they persist across tab switches
  const [gymTeam, setGymTeam] = useState([]);
  const [challengerTeam, setChallengerTeam] = useState([]);
  const [challengerMeta, setChallengerMeta] = useState({ model: 'none', avgScore: 0 });

  return (
    <div className="app-shell" data-type={currentType || undefined}>
      <TypeBackground currentType={currentType} />
      
      <header className="glass-header">
          <p className="screen-kicker">GROUP 6 - BATTLE LINK CONSOLE</p>
          <h1>Group 6 | Pokemon Day II System</h1>
          <nav className="engine-tabs">
              <button 
                className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => setActiveTab('team')}
              >
                Team Engine
              </button>
              <button 
                className={`tab-btn ${activeTab === 'challenger' ? 'active' : ''}`}
                onClick={() => setActiveTab('challenger')}
              >
                Challenger Engine
              </button>
              <button 
                className={`tab-btn ${activeTab === 'prediction' ? 'active' : ''}`}
                onClick={() => setActiveTab('prediction')}
              >
                Battle Prediction Engine
              </button>
          </nav>
      </header>

      <main className="container">
          {activeTab === 'team' && (
            <TeamEngine gymTeam={gymTeam} setGymTeam={setGymTeam} onTypeGenerated={setCurrentType} />
          )}
          {activeTab === 'challenger' && (
            <ChallengerEngine gymTeam={gymTeam} challengerTeam={challengerTeam} setChallengerTeam={setChallengerTeam} setChallengerMeta={setChallengerMeta} />
          )}
          {activeTab === 'prediction' && (
            <PredictionEngine gymTeam={gymTeam} challengerTeam={challengerTeam} challengerMeta={challengerMeta} />
          )}
      </main>
    </div>
  );
}

export default App;
