'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { predictBattle } from '../utils/predictionModels';
import { exportAnalyticsToCSV } from '../utils/csvExporter';
import ShowdownExport from './ShowdownExport';
import ShowdownSprite from './ShowdownSprite';

function MiniCard({ pokemon }) {
    return (
        <div className="mini-card" title={pokemon.name.toUpperCase()}>
            <ShowdownSprite pokemon={pokemon} />
        </div>
    );
}

function EmptyMiniCard() {
    return (
        <div className="mini-card mini-card-empty" aria-hidden="true">
            ?
        </div>
    );
}

function SystemNoticeModal({ open, message, onClose }) {
    if (!open) return null;
    return (
        <AnimatePresence>
            <motion.div
                key="overlay"
                className="battle-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.div
                key="modal"
                className="battle-modal"
                role="alertdialog"
                aria-modal="true"
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 6 }}
                transition={{ duration: 0.2 }}
                style={{ width: 'min(480px, calc(100vw - 24px))' }}
            >
                <div className="battle-reveal-panel" style={{ marginTop: 0 }}>
                    <div className="result-label">System Notice</div>
                    <div className="retro-dialogue" style={{ minHeight: 'unset' }}>{message}</div>
                    <button className="primary-btn" style={{ marginTop: '0.65rem' }} onClick={onClose}>OK</button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function BattleTeamSide({ title, team, teamName }) {
    const slots = Array.from({ length: 6 }, (_, index) => team[index] || null);

    return (
        <div className="battle-team-side">
            <h3>{title}</h3>
            <div className="mini-grid">
                {slots.map((pokemon, idx) => (
                    pokemon
                        ? <MiniCard key={`${pokemon.id}-${idx}`} pokemon={pokemon} />
                        : <EmptyMiniCard key={`empty-${idx}`} />
                ))}
            </div>
        </div>
    );
}

const ANALYZE_TEXT = 'ANALYZING TEAM DATA...';
const PRE_BATTLE_DRAFT_KEY = 'pokemonDayPreBattleDraftV1';
const TRAINER_BASE_URL = 'https://play.pokemonshowdown.com/sprites/trainers';

const normalizeRegion = (value = '') => {
    const v = String(value).trim().toLowerCase();
    if (v.includes('hoenn')) return 'hoenn';
    if (v.includes('sinnoh')) return 'sinnoh';
    if (v.includes('galar')) return 'galar';
    return 'hoenn';
};

const getTrainerSpritesByRegion = (regionValue = '') => {
    const region = normalizeRegion(regionValue);
    const byRegion = {
        hoenn: { gym: 'brendan', challenger: 'may', fallback: 'acetrainer-gen3' },
        sinnoh: { gym: 'lucas', challenger: 'dawn', fallback: 'acetrainer-gen4' },
        galar: { gym: 'victor', challenger: 'gloria', fallback: 'acetrainer' },
    };
    const selected = byRegion[region] || byRegion.hoenn;
    return {
        gym: [selected.gym, selected.fallback, 'acetrainer'],
        challenger: [selected.challenger, selected.fallback, 'acetrainer'],
    };
};

const getGymLeaderProfile = (regionValue = '', typeValue = '') => {
    const region = normalizeRegion(regionValue);
    const type = String(typeValue || '').trim().toLowerCase();

    const byRegion = {
        hoenn: {
            rock: { leader: 'Roxanne', sprite: 'roxanne', badge: 'Stone Badge' },
            fighting: { leader: 'Brawly', sprite: 'brawly', badge: 'Knuckle Badge' },
            electric: { leader: 'Wattson', sprite: 'wattson', badge: 'Dynamo Badge' },
            fire: { leader: 'Flannery', sprite: 'flannery', badge: 'Heat Badge' },
            normal: { leader: 'Norman', sprite: 'norman', badge: 'Balance Badge' },
            flying: { leader: 'Winona', sprite: 'winona', badge: 'Feather Badge' },
            psychic: { leader: 'Tate & Liza', sprite: 'tate', badge: 'Mind Badge' },
            water: { leader: 'Wallace', sprite: 'wallace', badge: 'Rain Badge' },
        },
        sinnoh: {
            rock: { leader: 'Roark', sprite: 'roark', badge: 'Coal Badge' },
            grass: { leader: 'Gardenia', sprite: 'gardenia', badge: 'Forest Badge' },
            fighting: { leader: 'Maylene', sprite: 'maylene', badge: 'Cobble Badge' },
            water: { leader: 'Crasher Wake', sprite: 'crasherwake', badge: 'Fen Badge' },
            ghost: { leader: 'Fantina', sprite: 'fantina', badge: 'Relic Badge' },
            steel: { leader: 'Byron', sprite: 'byron', badge: 'Mine Badge' },
            ice: { leader: 'Candice', sprite: 'candice', badge: 'Icicle Badge' },
            electric: { leader: 'Volkner', sprite: 'volkner', badge: 'Beacon Badge' },
        },
        galar: {
            grass: { leader: 'Milo', sprite: 'milo', badge: 'Grass Badge' },
            water: { leader: 'Nessa', sprite: 'nessa', badge: 'Water Badge' },
            fire: { leader: 'Kabu', sprite: 'kabu', badge: 'Fire Badge' },
            fighting: { leader: 'Bea', sprite: 'bea', badge: 'Fighting Badge' },
            ghost: { leader: 'Allister', sprite: 'allister', badge: 'Ghost Badge' },
            fairy: { leader: 'Opal', sprite: 'opal', badge: 'Fairy Badge' },
            ice: { leader: 'Melony', sprite: 'melony', badge: 'Ice Badge' },
            dark: { leader: 'Piers', sprite: 'piers', badge: 'Dark Badge' },
            dragon: { leader: 'Raihan', sprite: 'raihan', badge: 'Dragon Badge' },
            electric: { leader: 'Nessa', sprite: 'nessa', badge: 'Gym Badge' },
            steel: { leader: 'Victor', sprite: 'victor', badge: 'Gym Badge' },
            psychic: { leader: 'Bede', sprite: 'bede', badge: 'Psychic Badge' },
            normal: { leader: 'Victor', sprite: 'victor', badge: 'Gym Badge' },
            flying: { leader: 'Victor', sprite: 'victor', badge: 'Gym Badge' },
            rock: { leader: 'Gordie', sprite: 'gordie', badge: 'Rock Badge' },
            ground: { leader: 'Raihan', sprite: 'raihan', badge: 'Ground Badge' },
        }
    };

    const regionMap = byRegion[region] || {};
    const mapped = regionMap[type];
    if (mapped) {
        return mapped;
    }

    const fallbackByRegion = {
        hoenn: { leader: 'Gym Leader', sprite: 'brendan', badge: 'Gym Badge' },
        sinnoh: { leader: 'Gym Leader', sprite: 'lucas', badge: 'Gym Badge' },
        galar: { leader: 'Gym Leader', sprite: 'victor', badge: 'Gym Badge' },
    };
    return fallbackByRegion[region] || fallbackByRegion.hoenn;
};

function TrainerSprite({ spriteNames, alt, className = '' }) {
    const [idx, setIdx] = useState(0);
    useEffect(() => setIdx(0), [spriteNames?.join('|')]);
    const name = spriteNames?.[idx] || 'acetrainer';
    const src = `${TRAINER_BASE_URL}/${name}.png`;
    return (
        <img
            src={src}
            alt={alt}
            className={`trainer-sprite-img ${className}`.trim()}
            onError={() => {
                if (idx < (spriteNames?.length || 1) - 1) setIdx((v) => v + 1);
            }}
        />
    );
}

function fillValue(target, duration, onUpdate, onDone) {
    const start = performance.now();
    const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        onUpdate(target * eased);
        if (t < 1) {
            requestAnimationFrame(tick);
        } else if (onDone) {
            onDone();
        }
    };
    requestAnimationFrame(tick);
}

function BattlePredictionModal({ isOpen, prediction, gymLeaderName, challengerName, gymRegion, gymType, onClose }) {
    const [stage, setStage] = useState('transition');
    const [closing, setClosing] = useState(false);
    const [analysisText, setAnalysisText] = useState('');
    const [dotFrame, setDotFrame] = useState(0);
    const [confidenceDisplay, setConfidenceDisplay] = useState(0);
    const winnerText = (prediction?.predictedWinner || '').toUpperCase();
    const spriteSet = getTrainerSpritesByRegion(gymRegion);
    const gymLeaderProfile = getGymLeaderProfile(gymRegion, gymType);
    const revealWinnerFx = stage === 'reveal' || stage === 'done';
    const normalizedRegion = normalizeRegion(gymRegion);
    const displayRegion = normalizedRegion.charAt(0).toUpperCase() + normalizedRegion.slice(1);
    const displayType = (gymType || 'Mixed').charAt(0).toUpperCase() + (gymType || 'mixed').slice(1).toLowerCase();
    const challengerLabel = (challengerName || 'CHALLENGER').toUpperCase();
    const favoredLabel = winnerText === 'GYM' ? gymLeaderProfile.leader.toUpperCase() : challengerLabel;

    useEffect(() => {
        if (!isOpen) return undefined;
        setStage('transition');
        const timers = [
            setTimeout(() => setStage('vs'), 500),
            setTimeout(() => setStage('analysis'), 1300),
            setTimeout(() => setStage('reveal'), 2800),
            setTimeout(() => setStage('done'), 7000)
        ];
        return () => timers.forEach(clearTimeout);
    }, [isOpen]);

    useEffect(() => {
        if (stage !== 'analysis') return undefined;
        setAnalysisText('');
        let i = 0;
        const typeTimer = setInterval(() => {
            i += 1;
            setAnalysisText(ANALYZE_TEXT.slice(0, i));
            if (i >= ANALYZE_TEXT.length) clearInterval(typeTimer);
        }, 50);
        const dotTimer = setInterval(() => setDotFrame((v) => (v + 1) % 3), 300);
        return () => {
            clearInterval(typeTimer);
            clearInterval(dotTimer);
        };
    }, [stage]);

    useEffect(() => {
        if (stage !== 'reveal') return undefined;
        fillValue((prediction?.confidence || 0) * 100, 900, setConfidenceDisplay);
        return undefined;
    }, [stage, prediction]);

    const dots = '.'.repeat(dotFrame + 1);
    const closeModal = () => {
        setClosing(true);
        setStage('closing');
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className={`battle-modal-overlay ${closing ? 'closing' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />
                    <motion.div
                        className={`battle-modal ${stage} ${closing ? 'closing' : ''}`}
                        role="dialog"
                        aria-modal="true"
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 6 }}
                        transition={{ duration: 0.24 }}
                    >
                <div className="battle-modal-trainers">
                    <div className={`trainer-card gym ${winnerText === 'GYM' && revealWinnerFx ? 'winner-glow' : ''} ${winnerText === 'GYM' && stage === 'reveal' ? 'winner-pulse' : ''} ${winnerText === 'CHALLENGER' && revealWinnerFx ? 'loser-dim' : ''}`}>
                        <TrainerSprite spriteNames={[gymLeaderProfile.sprite, ...spriteSet.gym]} alt="Gym Leader trainer sprite" className="gym-sprite" />
                        <div className={`trainer-name ${stage === 'analysis' || stage === 'reveal' || stage === 'done' ? 'show' : ''}`}>
                            {gymLeaderProfile.leader.toUpperCase()}
                        </div>
                        <div className={`trainer-badge ${stage === 'analysis' || stage === 'reveal' || stage === 'done' ? 'show' : ''}`}>
                            {gymLeaderProfile.badge}
                        </div>
                        <div className={`trainer-subtitle ${stage === 'analysis' || stage === 'reveal' || stage === 'done' ? 'show' : ''}`}>
                            {displayRegion} {displayType} Gym
                        </div>
                    </div>
                    {(stage === 'vs' || stage === 'analysis' || stage === 'reveal' || stage === 'done' || stage === 'closing') && (
                        <div className="battle-modal-vs">VS</div>
                    )}
                    <div className={`trainer-card challenger ${winnerText === 'CHALLENGER' && revealWinnerFx ? 'winner-glow' : ''} ${winnerText === 'CHALLENGER' && stage === 'reveal' ? 'winner-pulse' : ''} ${winnerText === 'GYM' && revealWinnerFx ? 'loser-dim' : ''}`}>
                        <div className={`trainer-name ${stage === 'analysis' || stage === 'reveal' || stage === 'done' ? 'show' : ''}`}>
                            {challengerLabel}
                        </div>
                        <div className={`trainer-badge ${stage === 'analysis' || stage === 'reveal' || stage === 'done' ? 'show' : ''}`}>
                            Challenger
                        </div>
                        <div className={`trainer-subtitle ${stage === 'analysis' || stage === 'reveal' || stage === 'done' ? 'show' : ''}`}>
                            {displayRegion}
                        </div>
                        <TrainerSprite spriteNames={spriteSet.challenger} alt="Challenger trainer sprite" className="challenger-sprite" />
                    </div>
                </div>

                {(stage === 'analysis' || stage === 'reveal' || stage === 'done') && (
                    <div className="battle-analyze-line battle-analysis-banner">
                        BATTLE ANALYSIS
                    </div>
                )}

                {(stage === 'analysis' || stage === 'reveal' || stage === 'done') && (
                    <div className="battle-analyze-line">
                        {analysisText || ANALYZE_TEXT}
                        <span className="battle-analyze-dots">{dots}</span>
                    </div>
                )}

                {(stage === 'reveal' || stage === 'done') && (
                    <div className="battle-white-flash" aria-hidden="true" />
                )}

                {(stage === 'reveal' || stage === 'done') && (
                    <div className="battle-reveal-panel">
                        <div className={`winner-badge ${stage === 'reveal' || stage === 'done' ? 'show' : ''}`}>{gymLeaderProfile.badge}</div>
                        <div className="winner-name">🏅 {favoredLabel} FAVORED</div>
                        <div className="confidence-label">{Math.round(confidenceDisplay)}%</div>
                        <div className="retro-dialogue">
                            {(prediction?.reason || 'A favorable matchup pattern was detected for this side.').slice(0, 120)}
                        </div>
                    </div>
                )}

                {(stage === 'done') && (
                    <>
                        <div className="sparkle-field" aria-hidden="true">
                            {Array.from({ length: 18 }, (_, i) => <span key={i} className="sparkle-dot" />)}
                        </div>
                        <button className="primary-btn" style={{ marginTop: '0.8rem' }} onClick={closeModal}>
                            Close
                        </button>
                    </>
                )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function PredictionEngine({ gymTeam, challengerTeam, challengerMeta }) {
    const { analytics, recordPreBattle, recordGroundTruth, getNextMatchId } = useAnalytics();

    // Pre-Battle State
    const [matchId, setMatchId] = useState('');
    const [gymLeaderName, setGymLeaderName] = useState('');
    const [challengerName, setChallengerName] = useState('');
    const [gymRegion, setGymRegion] = useState('');
    const [gymType, setGymType] = useState('');
    const [chalRegion, setChalRegion] = useState('');
    const [predModel, setPredModel] = useState('logisticRegression');

    // Post-Battle State
    const [selectedPendingId, setSelectedPendingId] = useState('');
    const [replayLink, setReplayLink] = useState('');
    const [screenshotLink, setScreenshotLink] = useState('');
    const [finalScore, setFinalScore] = useState('');
    const [turns, setTurns] = useState('');
    const [actualWinner, setActualWinner] = useState('');

    // Export State
    const [showGymExport, setShowGymExport] = useState(false);
    const [showChalExport, setShowChalExport] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [latestPrediction, setLatestPrediction] = useState(null);
    const [notice, setNotice] = useState('');
    const [draftHydrated, setDraftHydrated] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const raw = window.localStorage.getItem(PRE_BATTLE_DRAFT_KEY);
        if (raw) {
            try {
                const draft = JSON.parse(raw);
                setMatchId(draft.matchId || '');
                setGymLeaderName(draft.gymLeaderName || '');
                setChallengerName(draft.challengerName || '');
                setGymRegion(draft.gymRegion || '');
                setGymType(draft.gymType || '');
                setChalRegion(draft.chalRegion || '');
                setPredModel(draft.predModel || 'logisticRegression');
            } catch {
                // Ignore malformed saved drafts.
            }
        }
        setDraftHydrated(true);
    }, []);

    useEffect(() => {
        if (!draftHydrated) return;
        if (!matchId) {
            setMatchId(getNextMatchId());
        }
    }, [draftHydrated, matchId, analytics.pendingBattles.length, analytics.logs.length, analytics.groundTruthLogs?.length]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!draftHydrated || typeof window === 'undefined') return;
        window.localStorage.setItem(PRE_BATTLE_DRAFT_KEY, JSON.stringify({
            matchId,
            gymLeaderName,
            challengerName,
            gymRegion,
            gymType,
            chalRegion,
            predModel
        }));
    }, [draftHydrated, matchId, gymLeaderName, challengerName, gymRegion, gymType, chalRegion, predModel]);

    const handlePredict = async () => {
        if (gymTeam.length === 0 || challengerTeam.length === 0) {
            setNotice("Both teams must have Pokemon before predicting!");
            return;
        }
        if (!gymLeaderName || !challengerName) {
            setNotice("Please fill in Gym Leader Name and Challenger Name.");
            return;
        }

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gymTeam: gymTeam,
                    challengerTeam: challengerTeam,
                    modelName: predModel
                })
            });
            
            if (!response.ok) throw new Error("Backend prediction failed");
            const prediction = await response.json();
            
            if (!prediction) {
                setNotice("Prediction failed.");
                return;
            }

            const preBattleData = {
                match_id: matchId,
                gym_leader: gymLeaderName,
                challenger: challengerName,
                gym_region: gymRegion,
                gym_specialization: gymType,
                challenger_region: chalRegion,
                enginesUsed: {
                    challengerModel: challengerMeta?.model || 'none',
                    predictionModel: predModel
                },
                gym_team: gymTeam.map(p => p.name),
                challenger_team: challengerTeam.map(p => p.name),
                predicted_winner: prediction.predictedWinner,
                confidence_score: prediction.confidence,
                prediction_reason: prediction.reason,
                model_used: predModel
            };

            const saveResult = recordPreBattle(preBattleData);
            if (!saveResult.ok) {
                setNotice(saveResult.error);
                return;
            }
            setLatestPrediction(prediction);
            setModalOpen(true);
            
            // Generate the next match ID for the next entry
            setMatchId(getNextMatchId());
        } catch (e) {
            console.error(e);
            setNotice("Failed to get prediction from backend.");
        }
    };

    const handleRecordTruth = () => {
        if (!selectedPendingId) {
            setNotice("Please select a pending battle.");
            return;
        }
        if (!actualWinner) {
            setNotice("Please select the actual winner.");
            return;
        }

        const postBattleData = {
            replay_link: replayLink,
            screenshot_link: screenshotLink,
            final_score: finalScore,
            number_of_turns: turns,
            actual_winner: actualWinner
        };

        const saveResult = recordGroundTruth(selectedPendingId, postBattleData);
        if (!saveResult.ok) {
            setNotice(saveResult.error);
            return;
        }
        
        // Reset post-battle fields
        setSelectedPendingId('');
        setReplayLink('');
        setScreenshotLink('');
        setFinalScore('');
        setTurns('');
        setActualWinner('');
        setNotice("Ground truth recorded successfully!");
    };

    // Calculate Metrics
    const tp = analytics.truePositives || 0;
    const fp = analytics.falsePositives || 0;
    const fn = analytics.falseNegatives || 0;
    const tn = analytics.trueNegatives || 0;
    const total = analytics.totalBattles || 0;

    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
    const f1Score = precision + recall === 0 ? 0 : (2 * precision * recall).toFixed(2);
    const accuracy = total === 0 ? 0 : Math.round((analytics.correctPredictions / total) * 100);
    const avgBrier = total === 0 ? 0 : (analytics.totalBrierScore / total).toFixed(4);
    const avgLogLoss = total === 0 ? 0 : (analytics.totalLogLoss / total).toFixed(4);

    // Helper functions for metric color coding
    const getAccuracyColor = () => {
        if (accuracy === 100) return '#30c030';
        if (accuracy >= 80) return '#d0d020';
        return '#e83030';
    };

    const getPrecisionRecallColor = (value) => {
        const num = parseFloat(value);
        if (num === 1.00) return '#30c030';
        if (num >= 0.80) return '#d0d020';
        return '#e83030';
    };

    const getF1ScoreColor = (value) => {
        const num = parseFloat(value);
        if (num === 1.00 || num === 2.00) return '#30c030';
        if (num >= 0.80) return '#d0d020';
        return '#e83030';
    };

    const getBrierLogLossColor = (value) => {
        const num = parseFloat(value);
        if (num < 0.05) return '#30c030';
        if (num < 0.15) return '#d0d020';
        return '#e83030';
    };

    return (
        <section className="engine-section active glass-panel" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <BattlePredictionModal
                isOpen={modalOpen}
                prediction={latestPrediction}
                gymLeaderName={gymLeaderName}
                challengerName={challengerName}
                gymRegion={gymRegion}
                gymType={gymType}
                onClose={() => setModalOpen(false)}
            />
            <SystemNoticeModal open={Boolean(notice)} message={notice} onClose={() => setNotice('')} />
            <h2 style={{ margin: 0, display: 'block', textAlign: 'center', width: '100%' }}>Battle Prediction Engine</h2>
            
            <div className="battle-arena" style={{ margin: 0 }}>
                        <BattleTeamSide
                            title="Gym Leader Team"
                            team={gymTeam}
                            teamName="Gym Leader"
                        />
                        <div className="vs-badge">VS</div>
                        <BattleTeamSide
                            title="Challenger Team"
                            team={challengerTeam}
                            teamName="Challenger"
                        />
                    </div>

                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', margin: '0.6rem 0' }} />

                    {/* Export row - full width below the arena */}
                    <div className="export-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="export-col" style={{ width: '50%' }}>
                            <button
                                className="primary-btn arena-export-btn"
                                onClick={() => setShowGymExport(!showGymExport)}
                                disabled={gymTeam.length === 0}
                            >
                                {showGymExport ? 'Hide Export' : 'Show Export'}
                            </button>
                            {showGymExport && <ShowdownExport team={gymTeam} teamName="Gym Leader" />}
                        </div>
                        <div className="export-col" style={{ width: '50%' }}>
                            <button
                                className="primary-btn arena-export-btn"
                                onClick={() => setShowChalExport(!showChalExport)}
                                disabled={challengerTeam.length === 0}
                            >
                                {showChalExport ? 'Hide Export' : 'Show Export'}
                            </button>
                            {showChalExport && <ShowdownExport team={challengerTeam} teamName="Challenger" />}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
                        {/* Left Column: Metrics */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="analytics-dashboard" style={{ margin: 0, background: 'rgba(231, 240, 194, 0.72)', padding: '1rem', border: '4px solid var(--line)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 className="panel-subheader" style={{ margin: 0 }}>Metrics Dashboard</h3>
                                    <button 
                                        className="primary-btn" 
                                        style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                                        onClick={() => exportAnalyticsToCSV(analytics)}
                                    >
                                        CSV Audit
                                    </button>
                                </div>
                                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    <div className="stat-card" style={{ padding: '0.5rem' }}><h4 style={{ fontSize: '10px', fontFamily: "'Press Start 2P', monospace", color: '#555', marginBottom: '0.3rem' }}>Accuracy</h4><p style={{ fontSize: '16px', fontFamily: "'Press Start 2P', monospace", fontWeight: 'bold', color: getAccuracyColor(), margin: 0 }}>{accuracy}%</p></div>
                                    <div className="stat-card" style={{ padding: '0.5rem' }}><h4 style={{ fontSize: '10px', fontFamily: "'Press Start 2P', monospace", color: '#555', marginBottom: '0.3rem' }}>Precision</h4><p style={{ fontSize: '16px', fontFamily: "'Press Start 2P', monospace", fontWeight: 'bold', color: getPrecisionRecallColor(precision.toFixed(2)), margin: 0 }}>{precision.toFixed(2)}</p></div>
                                    <div className="stat-card" style={{ padding: '0.5rem' }}><h4 style={{ fontSize: '10px', fontFamily: "'Press Start 2P', monospace", color: '#555', marginBottom: '0.3rem' }}>Recall</h4><p style={{ fontSize: '16px', fontFamily: "'Press Start 2P', monospace", fontWeight: 'bold', color: getPrecisionRecallColor(recall.toFixed(2)), margin: 0 }}>{recall.toFixed(2)}</p></div>
                                    <div className="stat-card" style={{ padding: '0.5rem' }}><h4 style={{ fontSize: '10px', fontFamily: "'Press Start 2P', monospace", color: '#555', marginBottom: '0.3rem' }}>F1-Score</h4><p style={{ fontSize: '16px', fontFamily: "'Press Start 2P', monospace", fontWeight: 'bold', color: getF1ScoreColor(f1Score), margin: 0 }}>{f1Score}</p></div>
                                    <div className="stat-card" style={{ padding: '0.5rem' }}><h4 style={{ fontSize: '10px', fontFamily: "'Press Start 2P', monospace", color: '#555', marginBottom: '0.3rem' }}>Avg Brier</h4><p style={{ fontSize: '16px', fontFamily: "'Press Start 2P', monospace", fontWeight: 'bold', color: getBrierLogLossColor(avgBrier), margin: 0 }}>{avgBrier}</p></div>
                                    <div className="stat-card" style={{ padding: '0.5rem' }}><h4 style={{ fontSize: '10px', fontFamily: "'Press Start 2P', monospace", color: '#555', marginBottom: '0.3rem' }}>Avg Log Loss</h4><p style={{ fontSize: '16px', fontFamily: "'Press Start 2P', monospace", fontWeight: 'bold', color: getBrierLogLossColor(avgLogLoss), margin: 0 }}>{avgLogLoss}</p></div>
                                    <div className="stat-card" style={{ gridColumn: 'span 3', padding: '0.5rem' }}>
                                        <h4 style={{ fontSize: '10px', fontFamily: "'Press Start 2P', monospace", color: '#555', marginBottom: '0.4rem', textAlign: 'center' }}>Confusion Matrix</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                                            <div style={{ background: '#1a3a1a', padding: '6px', color: '#58d028', fontFamily: "'Press Start 2P', monospace", fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>TP: {tp}</div>
                                            <div style={{ background: '#3a1a1a', padding: '6px', color: '#d83030', fontFamily: "'Press Start 2P', monospace", fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>FP: {fp}</div>
                                            <div style={{ background: '#3a1a1a', padding: '6px', color: '#d83030', fontFamily: "'Press Start 2P', monospace", fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>FN: {fn}</div>
                                            <div style={{ background: '#1a3a1a', padding: '6px', color: '#58d028', fontFamily: "'Press Start 2P', monospace", fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>TN: {tn}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Forms */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: 'rgba(231, 240, 194, 0.72)', padding: '1rem', border: '4px solid var(--line)' }}>
                                <h3 className="panel-subheader" style={{ marginBottom: '1rem' }}>Step 1: Pre-Battle Encoding</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <input type="text" placeholder="Match ID *" value={matchId} readOnly />
                                    <select value={predModel} onChange={e => setPredModel(e.target.value)}>
                                        <option value="logisticRegression">Logistic Regression</option>
                                        <option value="randomForest">Random Forest</option>
                                        <option value="naiveBayes">Naive Bayes</option>
                                    </select>
                                    <input type="text" placeholder="Gym Ldr Name *" value={gymLeaderName} onChange={e => setGymLeaderName(e.target.value)} />
                                    <input type="text" placeholder="Chal. Name *" value={challengerName} onChange={e => setChallengerName(e.target.value)} />
                                    <input type="text" placeholder="Gym Region" value={gymRegion} onChange={e => setGymRegion(e.target.value)} />
                                    <input type="text" placeholder="Chal. Region" value={chalRegion} onChange={e => setChalRegion(e.target.value)} />
                                    <input type="text" placeholder="Gym Spec." value={gymType} onChange={e => setGymType(e.target.value)} style={{ gridColumn: 'span 2' }} />
                                </div>
                                <button className="primary-btn pulse" onClick={handlePredict} style={{ width: '100%' }}>Lock In Prediction</button>
                            </div>
                            
                            <div style={{ background: 'rgba(231, 240, 194, 0.72)', padding: '1rem', border: '4px solid var(--line)' }}>
                                <h3 className="panel-subheader" style={{ marginBottom: '1rem' }}>Step 2: Ground Truth Logging</h3>
                                <div style={{ marginBottom: '1rem' }}>
                                    <select value={selectedPendingId} onChange={e => setSelectedPendingId(e.target.value)} style={{ width: '100%' }}>
                                        <option value="">-- Select Pending Battle --</option>
                                        {analytics.pendingBattles.map(b => (
                                            <option key={b.match_id || b.matchId} value={b.match_id || b.matchId}>
                                                {(b.match_id || b.matchId)}: {(b.gym_leader || b.gymLeaderName)} vs {(b.challenger || b.challengerName)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedPendingId && (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                            <input type="text" placeholder="Replay Link" value={replayLink} onChange={e => setReplayLink(e.target.value)} />
                                            <input type="text" placeholder="Photo Link" value={screenshotLink} onChange={e => setScreenshotLink(e.target.value)} />
                                            <input type="text" placeholder="Score (2-0)" value={finalScore} onChange={e => setFinalScore(e.target.value)} />
                                            <input type="number" placeholder="Turns" value={turns} onChange={e => setTurns(e.target.value)} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button className={`win-btn ${actualWinner === 'gym' ? 'active' : ''}`} style={{ flex: 1, opacity: actualWinner === 'gym' ? 1 : 0.6}} onClick={() => setActualWinner('gym')}>Gym Won</button>
                                            <button className={`win-btn ${actualWinner === 'challenger' ? 'active' : ''}`} style={{ flex: 1, opacity: actualWinner === 'challenger' ? 1 : 0.6}} onClick={() => setActualWinner('challenger')}>Chal. Won</button>
                                        </div>
                                        <button className="primary-btn" style={{ width: '100%', marginTop: '1rem', background: 'var(--success)' }} onClick={handleRecordTruth}>Save Ground Truth</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
        </section>
    );
}

