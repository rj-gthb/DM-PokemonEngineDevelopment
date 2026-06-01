'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './PreBattleAnalysisModal.module.css';

const OPEN_DELAY_MS = 0;
const SPRITE_SLIDE_MS = 400;
const VS_FADE_DELAY_MS = 300;
const TYPEWRITER_START_DELAY_MS = 400;
const TYPEWRITER_STEP_MS = 75;
const HP_FILL_DELAY_MS = 500;
const HP_FILL_MS = 1000;

const ANALYZE_TEXT = 'ANALYZING TEAM DATA......';

export default function PreBattleAnalysisModal({ visible, data, onContinue, onClose }) {
  const [typed, setTyped] = useState('');
  const [showVs, setShowVs] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [fillBar, setFillBar] = useState(false);

  const winPct = Math.max(0, Math.min(100, Math.round((data?.winProbability || 0) * 100)));
  const winnerName = (data?.favouredSide === 'gymLeader' ? data?.gymLeader?.name : data?.challenger?.name) || 'UNKNOWN';

  const description = useMemo(() => {
    if (data?.favouredSide === 'gymLeader') {
      return `The Gym Leader possesses stronger\nteam synergy and defensive coverage.`;
    }
    return `The Challenger applies stronger\noffensive pressure and speed control.`;
  }, [data]);

  useEffect(() => {
    if (!visible) return undefined;

    setTyped('');
    setShowVs(false);
    setShowAnalysis(false);
    setFillBar(false);

    const timers = [];
    timers.push(setTimeout(() => setShowVs(true), OPEN_DELAY_MS + VS_FADE_DELAY_MS));
    timers.push(setTimeout(() => setShowAnalysis(true), OPEN_DELAY_MS + TYPEWRITER_START_DELAY_MS));
    timers.push(setTimeout(() => setFillBar(true), OPEN_DELAY_MS + HP_FILL_DELAY_MS));

    const startTypeTimer = setTimeout(() => {
      let idx = 0;
      const iv = setInterval(() => {
        idx += 1;
        setTyped(ANALYZE_TEXT.slice(0, idx));
        if (idx >= ANALYZE_TEXT.length) clearInterval(iv);
      }, TYPEWRITER_STEP_MS);
      timers.push(iv);
    }, OPEN_DELAY_MS + TYPEWRITER_START_DELAY_MS);
    timers.push(startTypeTimer);

    return () => timers.forEach((t) => clearTimeout(t));
  }, [visible]);

  if (!visible || !data) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Pre-battle analysis">
      <div className={styles.modal}>
        <div className={styles.rainbowBar} />

        <section className={styles.vsSection}>
          <div className={styles.burst} />
          <div className={styles.vignette} />

          <div className={`${styles.spriteWrap} ${styles.left} ${styles.spriteIn}`} style={{ animationDuration: `${SPRITE_SLIDE_MS}ms` }}>
            <img src={data.gymLeader.spriteUrl} alt={data.gymLeader.name} className={styles.sprite} />
            <div className={styles.nameplate}>
              <div className={styles.name}>{data.gymLeader.name.toUpperCase()}</div>
              <div className={styles.sub}>{data.gymLeader.badge}</div>
              <div className={styles.sub}>{data.gymLeader.location}</div>
            </div>
          </div>

          <div className={`${styles.vsText} ${showVs ? styles.vsVisible : ''}`}>VS</div>

          <div className={`${styles.spriteWrap} ${styles.right} ${styles.spriteIn}`} style={{ animationDuration: `${SPRITE_SLIDE_MS}ms` }}>
            <img src={data.challenger.spriteUrl} alt={data.challenger.name} className={styles.sprite} />
            <div className={styles.nameplate}>
              <div className={styles.name}>{data.challenger.name.toUpperCase()}</div>
              <div className={styles.sub}>{data.challenger.title}</div>
              <div className={styles.sub}>{data.challenger.region}</div>
            </div>
          </div>
        </section>

        <section className={styles.dialog}>
          <div className={styles.header}>BATTLE ANALYSIS</div>

          <div className={styles.typeRow}>{showAnalysis ? typed : ''}</div>
          <div className={styles.badgeDivider}>- {data.gymLeader.badge.toUpperCase()} -</div>

          <div className={styles.resultBox}>
            <div className={styles.star}>?</div>
            <div className={styles.favored}>{winnerName.toUpperCase()} FAVORED</div>
            <div className={styles.percent}>{winPct}%</div>

            <div className={styles.hpRow}>
              <span className={styles.hpLabel}>WIN</span>
              <div className={styles.hpOuter}>
                <div
                  className={styles.hpFill}
                  style={{
                    width: fillBar ? `${winPct}%` : '0%',
                    transitionDuration: `${HP_FILL_MS}ms`,
                    transitionDelay: `${HP_FILL_DELAY_MS}ms`,
                  }}
                />
              </div>
              <span className={styles.hpNum}>{winPct}%</span>
            </div>
          </div>

          <div className={styles.textBox}>
            <div className={styles.desc}>{description}</div>
            <span className={styles.cursor}>?</span>
          </div>

          <button
            className={styles.cta}
            type="button"
            onClick={() => {
              onContinue?.();
              onClose?.();
            }}
          >
            CONTINUE
          </button>
        </section>
      </div>
    </div>
  );
}
