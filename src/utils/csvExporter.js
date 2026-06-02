export function exportAnalyticsToCSV(analytics) {
    if (!analytics) {
        alert("No analytics found to export!");
        return;
    }

    const escapeCSV = (str) => {
        if (str === null || str === undefined) return '""';
        const s = String(str);
        if (s.includes('"') || s.includes(',') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };

    const downloadCsv = (headers, rows, filename) => {
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const dateStamp = new Date().toISOString().slice(0, 10);

    const predictionHeaders = [
        'match_id',
        'gym_leader',
        'challenger',
        'gym_region',
        'challenger_region',
        'gym_specialization',
        'gym_team',
        'challenger_team',
        'predicted_winner',
        'confidence_score',
        'prediction_reason',
        'model_used',
        'timestamp_before_battle'
    ];
    const predictionRows = (analytics.predictionLogs || []).map((p) => [
        escapeCSV(p.match_id),
        escapeCSV(p.gym_leader),
        escapeCSV(p.challenger),
        escapeCSV(p.gym_region),
        escapeCSV(p.challenger_region),
        escapeCSV(p.gym_specialization),
        escapeCSV((p.gym_team || []).join('; ')),
        escapeCSV((p.challenger_team || []).join('; ')),
        escapeCSV(p.predicted_winner),
        escapeCSV(p.confidence_score),
        escapeCSV(p.prediction_reason),
        escapeCSV(p.model_used),
        escapeCSV(p.timestamp_before_battle)
    ].join(','));

    const groundTruthHeaders = [
        'match_id',
        'actual_winner',
        'correct_prediction',
        'final_score',
        'replay_link',
        'screenshot_link',
        'number_of_turns',
        'timestamp_after_battle'
    ];
    const groundTruthRows = (analytics.groundTruthLogs || []).map((g) => [
        escapeCSV(g.match_id),
        escapeCSV(g.actual_winner),
        escapeCSV(g.correct_prediction),
        escapeCSV(g.final_score),
        escapeCSV(g.replay_link),
        escapeCSV(g.screenshot_link),
        escapeCSV(g.number_of_turns),
        escapeCSV(g.timestamp_after_battle)
    ].join(','));

    const auditHeaders = [
        'audit_id',
        'action_done',
        'affected_record',
        'timestamp',
        'old_value',
        'new_value'
    ];
    const auditRows = (analytics.auditLogs || []).map((a) => [
        escapeCSV(a.audit_id),
        escapeCSV(a.action_done),
        escapeCSV(a.affected_record),
        escapeCSV(a.timestamp),
        escapeCSV(a.old_value ? JSON.stringify(a.old_value) : ''),
        escapeCSV(a.new_value ? JSON.stringify(a.new_value) : '')
    ].join(','));

    if (!predictionRows.length && !groundTruthRows.length && !auditRows.length) {
        alert('No prediction, ground truth, or audit logs to export.');
        return;
    }

    if (predictionRows.length) {
        downloadCsv(predictionHeaders, predictionRows, `prediction_logs_${dateStamp}.csv`);
    }
    if (groundTruthRows.length) {
        downloadCsv(groundTruthHeaders, groundTruthRows, `ground_truth_logs_${dateStamp}.csv`);
    }
    if (auditRows.length) {
        downloadCsv(auditHeaders, auditRows, `audit_logs_${dateStamp}.csv`);
    }
}
