'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pokemonDayAnalyticsV2';

const padMatchId = (n) => `M${String(n).padStart(3, '0')}`;

const parseMatchIdNumber = (matchId = '') => {
    const match = /^M(\d+)$/.exec(String(matchId).trim());
    return match ? parseInt(match[1], 10) : null;
};

const buildNextMatchId = (records = []) => {
    const maxId = records.reduce((max, rec) => {
        const n = parseMatchIdNumber(rec.match_id || rec.matchId);
        return n && n > max ? n : max;
    }, 0);
    return padMatchId(maxId + 1);
};

const createAuditEntry = (auditId, actionDone, affectedRecord, oldValue, newValue) => ({
    audit_id: auditId,
    action_done: actionDone,
    affected_record: affectedRecord,
    timestamp: new Date().toISOString(),
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
});

const normalizeState = (saved) => {
    if (!saved) {
        return {
            totalBattles: 0,
            correctPredictions: 0,
            gymWins: 0,
            challengerWins: 0,
            pendingBattles: [],
            logs: [],
            predictionLogs: [],
            groundTruthLogs: [],
            auditLogs: [],
            totalRemainingPokemon: 0,
            truePositives: 0,
            falsePositives: 0,
            falseNegatives: 0,
            trueNegatives: 0,
            modelSuccess: {},
            modelScores: [],
            totalBrierScore: 0,
            totalLogLoss: 0,
            lastAuditId: 0
        };
    }

    const predictionLogs = saved.predictionLogs || saved.pendingBattles || [];
    const groundTruthLogs = saved.groundTruthLogs || saved.logs || [];
    const pendingBattles = saved.pendingBattles || predictionLogs.filter(p => !groundTruthLogs.some(g => (g.match_id || g.matchId) === (p.match_id || p.matchId)));
    const logs = saved.logs || groundTruthLogs;

    return {
        ...saved,
        pendingBattles,
        logs,
        predictionLogs,
        groundTruthLogs,
        auditLogs: saved.auditLogs || [],
        lastAuditId: saved.lastAuditId || 0
    };
};

export function useAnalytics() {
    const [analytics, setAnalytics] = useState(() => {
        if (typeof window === 'undefined') {
            return normalizeState(null);
        }
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return normalizeState(saved ? JSON.parse(saved) : null);
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
    }, [analytics]);

    // Sync state across multiple tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEY) {
                if (e.newValue) {
                    setAnalytics(normalizeState(JSON.parse(e.newValue)));
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const getNextMatchId = () => buildNextMatchId([
        ...(analytics.predictionLogs || []),
        ...(analytics.groundTruthLogs || []),
        ...(analytics.pendingBattles || []),
        ...(analytics.logs || [])
    ]);

    const recordPreBattle = (preBattleData) => {
        const now = new Date().toISOString();
        const incomingMatchId = preBattleData.match_id || preBattleData.matchId;

        let result = { ok: true, error: '' };

        setAnalytics(prev => {
            const nextMatchId = incomingMatchId || buildNextMatchId([
                ...prev.predictionLogs,
                ...prev.groundTruthLogs,
                ...prev.pendingBattles,
                ...prev.logs
            ]);

            const idExists = [...prev.predictionLogs, ...prev.groundTruthLogs, ...prev.pendingBattles, ...prev.logs]
                .some(r => (r.match_id || r.matchId) === nextMatchId);
            if (idExists) {
                result = { ok: false, error: `Duplicate Match ID: ${nextMatchId}` };
                return prev;
            }

            const predictionRecord = {
                match_id: nextMatchId,
                gym_leader: preBattleData.gym_leader || preBattleData.gymLeaderName || '',
                challenger: preBattleData.challenger || preBattleData.challengerName || '',
                gym_region: preBattleData.gym_region || preBattleData.gymRegion || '',
                challenger_region: preBattleData.challenger_region || preBattleData.chalRegion || '',
                gym_specialization: preBattleData.gym_specialization || preBattleData.gymType || '',
                gym_team: preBattleData.gym_team || preBattleData.gymTeam || [],
                challenger_team: preBattleData.challenger_team || preBattleData.challengerTeam || [],
                predicted_winner: preBattleData.predicted_winner || preBattleData.predictedWinner || '',
                confidence_score: preBattleData.confidence_score ?? preBattleData.confidence ?? 0,
                prediction_reason: preBattleData.prediction_reason || preBattleData.reason || '',
                model_used: preBattleData.model_used || preBattleData.enginesUsed?.predictionModel || '',
                timestamp_before_battle: now,
                enginesUsed: preBattleData.enginesUsed || {}
            };

            const nextAuditId = prev.lastAuditId + 1;
            const audit = createAuditEntry(
                nextAuditId,
                'CREATE_PREDICTION',
                predictionRecord.match_id,
                null,
                predictionRecord
            );

            return {
                ...prev,
                pendingBattles: [...prev.pendingBattles, predictionRecord],
                predictionLogs: [...prev.predictionLogs, predictionRecord],
                auditLogs: [...prev.auditLogs, audit],
                lastAuditId: nextAuditId
            };
        });

        return result;
    };

    const recordGroundTruth = (matchId, postBattleData) => {
        let result = { ok: true, error: '' };

        setAnalytics(prev => {
            const battleIndex = prev.pendingBattles.findIndex(b => (b.match_id || b.matchId) === matchId);
            if (battleIndex === -1) {
                result = { ok: false, error: `Match ID ${matchId} does not exist in pending predictions.` };
                return prev;
            }

            const alreadyFinalized = prev.groundTruthLogs.some(g => (g.match_id || g.matchId) === matchId);
            if (alreadyFinalized) {
                result = { ok: false, error: `Match ID ${matchId} already has a ground truth record.` };
                return prev;
            }

            const battle = prev.pendingBattles[battleIndex];
            const newPending = [...prev.pendingBattles];
            newPending.splice(battleIndex, 1);

            const { actual_winner, replay_link, screenshot_link, final_score, number_of_turns, actualWinner, replayLink, screenshotLink, finalScore, turns } = postBattleData;
            const resolvedActualWinner = actual_winner || actualWinner;
            const resolvedReplayLink = replay_link || replayLink || '';
            const resolvedScreenshotLink = screenshot_link || screenshotLink || '';
            const resolvedFinalScore = final_score || finalScore || '';
            const resolvedTurns = number_of_turns || turns || '';

            const pred = battle.predicted_winner || battle.predictedWinner;
            const isCorrect = pred === resolvedActualWinner;
            
            // F1 metrics (Positive = Challenger Wins)
            let tp = prev.truePositives;
            let fp = prev.falsePositives;
            let fn = prev.falseNegatives;
            let tn = prev.trueNegatives;
            
            if (pred === 'challenger' && resolvedActualWinner === 'challenger') tp++;
            if (pred === 'challenger' && resolvedActualWinner === 'gym') fp++;
            if (pred === 'gym' && resolvedActualWinner === 'challenger') fn++;
            if (pred === 'gym' && resolvedActualWinner === 'gym') tn++;

            // Model success tracking (Challenger Engine models)
            let ms = { ...prev.modelSuccess };
            if (battle.enginesUsed?.challengerModel) {
                const cModel = battle.enginesUsed.challengerModel;
                if (!ms[cModel]) ms[cModel] = { wins: 0, usages: 0 };
                ms[cModel].usages++;
                if (resolvedActualWinner === 'challenger') ms[cModel].wins++;
            }

            // Confidence Metrics
            // Assuming battle.confidence is the probability that the PREDICTED winner wins.
            // Let's normalize `p` as the probability that CHALLENGER wins.
            const confidence = battle.confidence_score ?? battle.confidence ?? 0;
            let pChallenger = pred === 'challenger' ? confidence : (1 - confidence);
            let y = resolvedActualWinner === 'challenger' ? 1 : 0;
            
            // Brier Score: (p - y)^2
            const brierScore = Math.pow(pChallenger - y, 2);
            
            // Log Loss: -(y * ln(p) + (1-y) * ln(1-p))
            // Clamp p to avoid log(0)
            const pClamped = Math.max(Math.min(pChallenger, 1 - 1e-15), 1e-15);
            const logLoss = -(y * Math.log(pClamped) + (1 - y) * Math.log(1 - pClamped));

            const timestamp_after_battle = new Date().toISOString();
            const groundTruthRecord = {
                match_id: matchId,
                actual_winner: resolvedActualWinner,
                correct_prediction: isCorrect,
                final_score: resolvedFinalScore,
                replay_link: resolvedReplayLink,
                screenshot_link: resolvedScreenshotLink,
                number_of_turns: resolvedTurns,
                timestamp_after_battle
            };

            const completedBattle = { ...battle, ...groundTruthRecord, brierScore, logLoss };

            // Calculate remaining pokemon from final score (e.g., "2-0" means 2 remaining)
            let remaining = 0;
            if (resolvedFinalScore) {
                const parts = resolvedFinalScore.split('-');
                if (parts.length === 2) {
                    remaining = Math.max(parseInt(parts[0] || 0), parseInt(parts[1] || 0));
                }
            }

            const nextAuditId = prev.lastAuditId + 1;
            const audit = createAuditEntry(
                nextAuditId,
                'RECORD_GROUND_TRUTH',
                matchId,
                battle,
                groundTruthRecord
            );

            return {
                ...prev,
                pendingBattles: newPending,
                totalBattles: prev.totalBattles + 1,
                correctPredictions: prev.correctPredictions + (isCorrect ? 1 : 0),
                gymWins: prev.gymWins + (resolvedActualWinner === 'gym' ? 1 : 0),
                challengerWins: prev.challengerWins + (resolvedActualWinner === 'challenger' ? 1 : 0),
                totalRemainingPokemon: prev.totalRemainingPokemon + (remaining || 0),
                truePositives: tp,
                falsePositives: fp,
                falseNegatives: fn,
                trueNegatives: tn,
                modelSuccess: ms,
                totalBrierScore: prev.totalBrierScore + brierScore,
                totalLogLoss: prev.totalLogLoss + logLoss,
                logs: [...prev.logs, completedBattle],
                groundTruthLogs: [...prev.groundTruthLogs, groundTruthRecord],
                auditLogs: [...prev.auditLogs, audit],
                lastAuditId: nextAuditId
            };
        });

        return result;
    };

    return { analytics, recordPreBattle, recordGroundTruth, getNextMatchId };
}

