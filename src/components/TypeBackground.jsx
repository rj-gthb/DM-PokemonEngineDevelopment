'use client';

import { useEffect, useState } from 'react';
import './type-backgrounds.css';

const starPoints = [[18, 20], [48, 34], [92, 18], [128, 42], [176, 24], [232, 36], [286, 18], [344, 42], [374, 22]];
const particleXs = [24, 58, 96, 138, 176, 220, 258, 304, 348, 382];

const Svg = ({ base, className = '', children }) => (
    <svg className={`type-bg-svg ${className}`} viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="225" fill={base} />
        {children}
    </svg>
);

const Stars = ({ color = '#ffffff', accent = '#ffe88a' }) => (
    <g className="bg-layer particles">
        {starPoints.map(([x, y], index) => (
            <rect
                className={index % 3 === 0 ? 'twinkle-a' : index % 3 === 1 ? 'twinkle-b' : ''}
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="2"
                height="2"
                fill={index % 2 ? color : accent}
            />
        ))}
    </g>
);

const PixelMoon = ({ base = '#0f172a', x = 332, y = 18 }) => (
    <g>
        <rect x={x + 10} y={y} width="16" height="4" fill="#fff4c8" />
        <rect x={x + 4} y={y + 4} width="28" height="8" fill="#fff4c8" />
        <rect x={x} y={y + 12} width="32" height="12" fill="#fff4c8" />
        <rect x={x + 4} y={y + 24} width="24" height="8" fill="#fff4c8" />
        <rect x={x + 20} y={y + 4} width="16" height="28" fill={base} />
    </g>
);

const DefaultScene = () => (
    <Svg base="#0f172a" className="scene-default">
        <g className="bg-layer far"><Stars /><PixelMoon /></g>
        <g className="bg-layer mid"><rect x="0" y="170" width="400" height="55" fill="#0b1020" /></g>
        <g className="bg-layer silhouettes"><rect className="breeze-slow" x="42" y="178" width="28" height="5" fill="rgba(0,0,0,0.25)" /></g>
        <g className="bg-layer foreground"><rect x="0" y="204" width="400" height="21" fill="#080c18" /></g>
    </Svg>
);

const WaterScene = () => (
    <Svg base="#0a2a5a" className="scene-water">
        <g className="bg-layer far">
            <rect x="0" y="0" width="400" height="70" fill="#1a5a9a" />
            <rect x="0" y="70" width="400" height="92" fill="#0d3a7a" />
            <rect x="0" y="162" width="400" height="63" fill="#0a2a5a" />
            {[26, 92, 172, 252, 328].map((x, index) => (
                <polygon className="ray-sway" style={{ animationDelay: `${index * -0.8}s` }} key={x} points={`${x},0 ${x + 10},0 ${x + 64},225 ${x + 52},225`} fill="rgba(255,255,255,0.06)" />
            ))}
            <g className="surface-undulate">
                {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 36} y={15 + (i % 2) * 3} width="24" height="3" fill="#4a9acc" />)}
                {[30, 108, 218, 318].map((x) => <g key={x}><rect x={x} y="10" width="4" height="2" fill="#ffffff" /><rect x={x + 6} y="12" width="2" height="2" fill="#ffffff" /></g>)}
            </g>
        </g>
        <g className="bg-layer mid">
            {[15, 42, 318, 352, 378].map((x, i) => (
                <g className="seaweed-sway" style={{ animationDelay: `${i * -0.6}s` }} key={x}>
                    {Array.from({ length: 7 }, (_, j) => <rect key={j} x={x + (j % 2) * 3} y={174 - j * 11} width="5" height="13" fill={j % 2 ? '#2a8a4a' : '#1a6a3a'} />)}
                </g>
            ))}
            {[56, 220, 286].map((x, i) => (
                <g className="fish-school" style={{ animationDelay: `${i * -3}s` }} key={x}>
                    <polygon points={`${x},88 ${x + 7},84 ${x + 7},92`} fill="rgba(0,0,0,0.26)" />
                    <polygon points={`${x + 14},96 ${x + 21},92 ${x + 21},100`} fill="rgba(0,0,0,0.26)" />
                    <polygon points={`${x + 28},86 ${x + 35},82 ${x + 35},90`} fill="rgba(0,0,0,0.26)" />
                </g>
            ))}
        </g>
        <g className="bg-layer silhouettes">
            <g className="lapras-glide" fill="rgba(0,0,0,0.36)">
                <rect x="20" y="116" width="56" height="16" /><rect x="30" y="108" width="34" height="10" /><rect x="64" y="92" width="8" height="28" /><rect x="70" y="88" width="16" height="8" /><rect x="8" y="120" width="16" height="8" />
            </g>
            <g className="magikarp-dart" fill="rgba(0,0,0,0.32)">
                <rect x="260" y="96" width="22" height="10" /><polygon points="282,96 294,101 282,106" /><rect x="254" y="98" width="6" height="6" />
            </g>
            <g className="horsea-bob" fill="rgba(0,0,0,0.3)">
                <rect x="304" y="148" width="12" height="18" /><rect x="314" y="142" width="12" height="8" /><rect x="300" y="164" width="8" height="10" /><rect x="294" y="170" width="10" height="4" />
            </g>
        </g>
        <g className="bg-layer foreground">
            <rect x="0" y="196" width="400" height="29" fill="#0a1a2a" />
            {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 28} y={196 + (i % 3) * 7} width={18 + (i % 2) * 8} height="8" fill={i % 2 ? '#1a2a3a' : '#0a1a2a'} />)}
            {[94, 118, 266, 292].map((x) => <rect key={x} x={x} y="190" width="5" height="10" fill="#8a4a5a" />)}
        </g>
        <g className="bg-layer particles">
            {particleXs.map((x, i) => <circle className="bubble-rise" style={{ animationDelay: `${i * -0.7}s`, animationDuration: `${6 + (i % 5)}s` }} key={x} cx={x} cy={208 - (i % 4) * 20} r={i % 2 ? 2 : 3} fill="rgba(255,255,255,0.3)" />)}
        </g>
    </Svg>
);

const FireScene = () => (
    <Svg base="#0f0200" className="scene-fire">
        <g className="bg-layer far">
            <rect x="0" y="122" width="400" height="103" fill="#2a0500" />
            <polygon points="112,170 200,48 286,170" fill="#080100" />
            <rect x="196" y="72" width="8" height="76" fill="#cc3300" /><rect x="204" y="92" width="8" height="56" fill="#ff5500" />
            <g className="charizard-orbit" fill="rgba(0,0,0,0.35)">
                <rect x="40" y="62" width="20" height="14" /><polygon points="38,66 12,50 34,82" /><polygon points="60,66 88,50 64,82" /><rect x="56" y="74" width="18" height="5" />
            </g>
        </g>
        <g className="bg-layer mid">
            {[38, 90, 148, 240, 308, 360].map((x, i) => (
                <g className="flame-column" style={{ animationDelay: `${i * -0.24}s`, animationDuration: `${1 + (i % 3) * 0.35}s` }} key={x}>
                    <rect x={x} y="178" width="26" height="16" fill="#ff5500" /><rect x={x + 5} y="164" width="16" height="14" fill="#ff9a00" /><rect x={x + 10} y="154" width="6" height="10" fill="#fff0a0" />
                </g>
            ))}
            <g className="magmar-bob" fill="rgba(0,0,0,0.34)"><rect x="270" y="162" width="28" height="32" /><rect x="262" y="172" width="8" height="18" /><rect x="298" y="170" width="10" height="20" /></g>
        </g>
        <g className="bg-layer silhouettes">
            <g className="slugma-crawl" fill="rgba(0,0,0,0.36)"><rect x="44" y="190" width="34" height="12" /><rect x="66" y="182" width="14" height="10" /><rect x="78" y="186" width="8" height="4" /></g>
        </g>
        <g className="bg-layer foreground lava-cycle">
            {Array.from({ length: 18 }, (_, i) => <rect key={i} x={i * 24} y={190 + (i % 2) * 8} width="24" height="35" fill={i % 2 ? '#cc3300' : '#ff5500'} />)}
        </g>
        <g className="bg-layer particles">
            {Array.from({ length: 18 }, (_, i) => <rect className="ember-float" style={{ animationDelay: `${i * -0.28}s`, animationDuration: `${3 + (i % 4) * 0.6}s` }} key={i} x={(i * 37) % 390} y={170 - (i % 6) * 18} width="2" height="2" fill={i % 2 ? '#ffcc44' : '#ff6600'} />)}
            {Array.from({ length: 14 }, (_, i) => <rect className="ash-fall" style={{ animationDelay: `${i * -0.4}s` }} key={`a${i}`} x={(i * 29) % 400} y={(i * 17) % 120} width="1" height="1" fill="#888888" opacity="0.35" />)}
        </g>
    </Svg>
);

const GrassScene = () => (
    <Svg base="#020a02" className="scene-grass">
        <g className="bg-layer far">
            <rect x="168" y="0" width="64" height="46" fill="rgba(255,255,200,0.04)" />
            {[20, 88, 154, 246, 324].map((x) => <g key={x}><rect x={x} y="96" width="12" height="92" fill="#0a1a0a" /><rect x={x - 16} y="72" width="44" height="36" fill="#0a1a0a" /></g>)}
            <g className="flygon-shift" fill="rgba(0,0,0,0.28)"><rect x="246" y="50" width="28" height="10" /><polygon points="246,54 212,40 236,70" /><polygon points="274,54 310,40 282,70" /></g>
        </g>
        <g className="bg-layer mid">
            {[52, 132, 220, 304].map((x) => <g key={x}><rect x={x} y="80" width="16" height="118" fill="#102010" /><rect x={x - 24} y="48" width="64" height="48" fill="#102010" /></g>)}
            <g className="sceptile-idle" fill="rgba(0,0,0,0.36)"><rect x="166" y="126" width="22" height="48" /><rect x="154" y="116" width="26" height="16" /><rect x="186" y="152" width="34" height="8" /><rect x="146" y="172" width="14" height="18" /></g>
            <g className="wurmple-inch" fill="rgba(0,0,0,0.32)"><rect x="78" y="112" width="10" height="8" /><rect x="88" y="114" width="10" height="8" /><rect x="98" y="116" width="10" height="8" /></g>
        </g>
        <g className="bg-layer foreground">
            <rect x="0" y="184" width="400" height="41" fill="#051205" />
            {Array.from({ length: 36 }, (_, i) => <rect key={i} x={i * 12} y={196 - (i % 4) * 4} width="5" height="18" fill={i % 2 ? '#2d6a1f' : '#3a8a28'} />)}
            {[42, 240, 336].map((x) => <g key={x}><rect x={x} y="188" width="34" height="9" fill="#3a210d" /><rect x={x + 4} y="186" width="18" height="3" fill="#5a3718" /></g>)}
            {[118, 296].map((x) => <g key={x}><rect x={x} y="192" width="4" height="4" fill="#ffff88" /><rect x={x - 2} y="194" width="8" height="2" fill="#ffffff" /></g>)}
        </g>
        <g className="bg-layer particles">
            {[45, 77, 146, 205, 276, 340].map((x, i) => <rect className="firefly-blink" style={{ animationDelay: `${i * 0.3}s` }} key={x} x={x} y={54 + (i % 4) * 24} width="2" height="2" fill="#aaff44" />)}
            {Array.from({ length: 10 }, (_, i) => <rect className="leaf-drift" style={{ animationDelay: `${i * -1.1}s`, animationDuration: `${10 + (i % 5)}s` }} key={i} x={(i * 38) % 380} y="-6" width="2" height="4" fill="#3a8a28" />)}
            {[80, 188, 318].map((x, i) => <rect className="dapple-pulse" style={{ animationDelay: `${i * -1}s` }} key={x} x={x} y={86} width="34" height="10" fill="rgba(255,255,200,0.04)" />)}
        </g>
    </Svg>
);

const ElectricScene = () => (
    <Svg base="#080808" className="scene-electric">
        <g className="bg-layer far">
            {[0, 58, 132, 220, 302].map((x, i) => <g key={x}><rect x={x} y={22 + (i % 2) * 12} width="88" height="24" fill="#111100" /><rect x={x + 18} y={8 + (i % 2) * 10} width="72" height="26" fill="#1a1a00" /></g>)}
            {[66, 190, 316].map((x, i) => <g className="bolt-flash-rich" style={{ animationDelay: `${i * 1.7}s`, animationDuration: `${4 + i * 2}s` }} key={x}><rect x={x - 30} y="0" width="80" height="225" fill="#ffffff" opacity="0.05" /><polygon points={`${x},36 ${x + 12},36 ${x + 2},72 ${x + 18},72 ${x - 4},128 ${x + 2},84 ${x - 12},84`} fill="#ffee00" /></g>)}
        </g>
        <g className="bg-layer mid">
            {[8, 52, 96, 150, 212, 268, 326, 366].map((x, i) => <g key={x}><rect x={x} y={150 - (i % 4) * 16} width={28 + (i % 3) * 8} height="75" fill="#050505" />{i % 2 === 0 && <rect className="window-blink" x={x + 8} y={166} width="4" height="3" fill="#ffcc33" />}</g>)}
        </g>
        <g className="bg-layer silhouettes">
            <g fill="rgba(0,0,0,0.38)"><rect x="72" y="130" width="18" height="22" /><rect x="68" y="126" width="26" height="8" /><rect x="54" y="138" width="16" height="6" /></g>
            <rect className="electrode-bounce" x="208" y="132" width="22" height="22" fill="rgba(0,0,0,0.34)" />
            <g className="jolteon-run" fill="rgba(0,0,0,0.36)"><rect x="0" y="142" width="28" height="12" /><polygon points="8,142 14,130 20,142" /><rect x="24" y="148" width="16" height="4" /></g>
        </g>
        <g className="bg-layer particles">
            {Array.from({ length: 36 }, (_, i) => <rect className="rain-fall" style={{ animationDelay: `${i * -0.05}s` }} key={i} x={(i * 13) % 400} y={(i * 19) % 225} width="1" height="4" fill="rgba(180,180,255,0.2)" />)}
        </g>
    </Svg>
);

const IceScene = () => (
    <Svg base="#050d14" className="scene-ice">
        <g className="bg-layer far">
            <rect className="aurora-drift" x="0" y="24" width="400" height="8" fill="rgba(0,80,60,0.08)" />
            <rect className="aurora-drift" style={{ animationDelay: '-2s' }} x="-60" y="44" width="400" height="6" fill="rgba(0,80,60,0.08)" />
            <polygon points="0,142 58,68 116,142" fill="#0a1520" /><polygon points="92,150 184,54 270,150" fill="#0d1a28" /><polygon points="232,146 330,62 400,146" fill="#0a1520" />
        </g>
        <g className="bg-layer mid">
            <rect x="68" y="158" width="260" height="24" fill="#18364a" />
            <rect x="92" y="164" width="42" height="2" fill="#a8d8e8" /><rect x="214" y="170" width="54" height="2" fill="#a8d8e8" />
            <g className="glalie-float" fill="rgba(0,0,0,0.34)"><rect x="240" y="110" width="24" height="24" /><rect x="234" y="118" width="36" height="8" /></g>
        </g>
        <g className="bg-layer silhouettes">
            <g fill="rgba(0,0,0,0.37)"><rect x="98" y="150" width="42" height="20" /><rect x="108" y="136" width="24" height="16" /><rect x="86" y="158" width="14" height="8" /></g>
            <g className="sealeo-slide" fill="rgba(0,0,0,0.34)"><rect x="16" y="168" width="34" height="14" /><rect x="40" y="160" width="16" height="12" /></g>
        </g>
        <g className="bg-layer foreground">
            <rect x="0" y="178" width="400" height="47" fill="#e8f4f8" />
            {Array.from({ length: 11 }, (_, i) => <rect key={i} x={i * 40} y="0" width="8" height={28 + (i % 4) * 7} fill="#86cde0" />)}
        </g>
        <g className="bg-layer particles">
            {Array.from({ length: 28 }, (_, i) => <rect className="snowfall" style={{ animationDelay: `${i * -0.22}s`, animationDuration: `${5 + (i % 5)}s` }} key={i} x={(i * 31) % 398} y={(i * 17) % 225} width="2" height="2" fill="#ffffff" />)}
            {[36, 150, 270].map((x, i) => <rect className="wind-streak" style={{ animationDelay: `${i * -1.2}s` }} key={x} x={x} y={72 + i * 28} width="70" height="2" fill="rgba(255,255,255,0.03)" />)}
        </g>
    </Svg>
);

const PsychicScene = () => (
    <Svg base="#0a0014" className="scene-psychic">
        <g className="bg-layer far"><Stars color="#cc00cc" accent="#ff0088" />{[80, 260].map((x) => <rect className="ruin-float" key={x} x={x} y="46" width="36" height="10" fill="#211030" />)}</g>
        <g className="bg-layer mid">{[90, 202, 314].map((x, i) => <rect className="orb-orbit-rich" style={{ animationDelay: `${i * -2}s` }} key={x} x={x} y="84" width="8" height="8" fill={i % 2 ? '#ff0088' : '#cc00cc'} />)}</g>
        <g className="bg-layer silhouettes"><g className="silhouette-bob" fill="rgba(0,0,0,0.35)"><rect x="130" y="126" width="18" height="42" /><rect x="120" y="112" width="38" height="18" /><rect x="110" y="144" width="24" height="6" /></g><g className="silhouette-bob-slow" fill="rgba(0,0,0,0.35)"><rect x="260" y="130" width="28" height="28" /><rect x="248" y="124" width="8" height="34" /><rect x="292" y="124" width="8" height="34" /></g></g>
        <g className="bg-layer foreground">{[120, 200, 280].map((x, i) => <rect className="ripple-pulse" style={{ animationDelay: `${i * -0.8}s` }} key={x} x={x} y={176} width="48" height="4" fill="#4b1a70" opacity="0.55" />)}</g>
        <g className="bg-layer particles">{[44, 178, 238, 346].map((x, i) => <rect className="twinkle-a" style={{ animationDelay: `${i * 0.4}s` }} key={x} x={x} y={42 + i * 20} width="2" height="2" fill="#ff0088" />)}</g>
    </Svg>
);

const GhostScene = () => (
    <Svg base="#04000a" className="scene-ghost">
        <g className="bg-layer far"><rect x="260" y="72" width="94" height="86" fill="#09000f" /><rect x="280" y="50" width="50" height="24" fill="#09000f" />{[286, 322].map((x) => <rect className="window-blink" key={x} x={x} y="94" width="6" height="8" fill="#351050" />)}</g>
        <g className="bg-layer mid">{[38, 104, 176, 246].map((x) => <g key={x}><rect x={x} y="154" width="20" height="34" fill="#252530" /><rect x={x - 4} y="154" width="28" height="6" fill="#333340" /></g>)}</g>
        <g className="bg-layer silhouettes"><g className="ghost-drift" fill="rgba(255,255,255,0.16)"><rect x="82" y="102" width="22" height="26" /><rect x="86" y="128" width="6" height="6" /><rect x="98" y="128" width="6" height="6" /></g><g className="ghost-drift-slow" fill="rgba(0,0,0,0.38)"><rect x="220" y="116" width="36" height="26" /><rect x="212" y="126" width="12" height="10" /><rect x="252" y="126" width="12" height="10" /></g></g>
        <g className="bg-layer foreground"><rect x="0" y="186" width="400" height="39" fill="#08000c" /><g className="mist-scroll">{Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 58} y={178 + (i % 2) * 10} width="44" height="8" fill="#2a0a40" opacity="0.45" />)}</g></g>
        <g className="bg-layer particles">{[70, 146, 304].map((x, i) => <rect className="wisp-rise" style={{ animationDelay: `${i * -1.2}s` }} key={x} x={x} y="170" width="4" height="4" fill="#8f52d0" opacity="0.6" />)}</g>
    </Svg>
);

const DragonScene = () => (
    <Svg base="#02001a" className="scene-dragon">
        <g className="bg-layer far"><polygon points="0,136 64,68 132,136" fill="#070026" /><polygon points="120,134 212,48 300,134" fill="#090033" /><polygon points="250,138 340,64 400,138" fill="#070026" /></g>
        <g className="bg-layer mid"><rect x="172" y="76" width="48" height="112" fill="#3c3c50" /><rect x="184" y="58" width="24" height="18" fill="#4a4a62" />{[88, 306].map((x) => <rect key={x} x={x} y="118" width="28" height="70" fill="#2d2d44" />)}</g>
        <g className="bg-layer silhouettes"><g className="dragon-circle" fill="rgba(0,0,0,0.34)"><rect x="80" y="70" width="36" height="14" /><polygon points="82,74 42,54 72,94" /><polygon points="114,74 152,54 124,94" /></g><g className="flygon-shift" fill="rgba(0,0,0,0.3)"><rect x="260" y="96" width="28" height="10" /><polygon points="260,100 232,88 252,112" /></g></g>
        <g className="bg-layer foreground"><rect x="0" y="188" width="400" height="37" fill="#070014" />{[40, 220, 338].map((x, i) => <rect className="energy-rise" style={{ animationDelay: `${i * -0.8}s` }} key={x} x={x} y="180" width="8" height="8" fill="#4820a8" />)}</g>
        <g className="bg-layer particles">{[132, 198, 270].map((x, i) => <rect className="crackle" style={{ animationDelay: `${i * 0.5}s` }} key={x} x={x} y={82 + i * 24} width="12" height="2" fill="#7a48ff" />)}</g>
    </Svg>
);

const FightingScene = () => (
    <Svg base="#100000" className="scene-fighting">
        <g className="bg-layer far">{Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 18} y={138 - (i % 4) * 8} width="10" height="30" fill="#080808" />)}</g>
        <g className="bg-layer mid"><rect x="0" y="166" width="400" height="59" fill="#1a1010" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 36} y="174" width="34" height="18" fill={i % 2 ? '#231111' : '#2a1515'} />)}</g>
        <g className="bg-layer silhouettes"><g className="fighter-idle" fill="rgba(0,0,0,0.38)"><rect x="116" y="116" width="28" height="52" /><rect x="90" y="126" width="26" height="10" /><rect x="144" y="124" width="24" height="10" /></g><g className="fighter-idle-slow" fill="rgba(0,0,0,0.35)"><rect x="250" y="126" width="22" height="42" /><rect x="238" y="110" width="36" height="16" /><rect x="272" y="134" width="24" height="8" /></g></g>
        <g className="bg-layer foreground">{[80, 200, 320].map((x, i) => <rect className="dust-puff" style={{ animationDelay: `${i * -0.45}s` }} key={x} x={x} y="174" width="42" height="8" fill="#4a2a20" opacity="0.6" />)}</g>
        <g className="bg-layer particles">{[150, 190, 232].map((x, i) => <rect className="impact-line" style={{ animationDelay: `${i * 0.28}s` }} key={x} x={x} y={98 + i * 18} width="52" height="3" fill="#aa0000" />)}</g>
    </Svg>
);

const PoisonScene = () => (
    <Svg base="#05000e" className="scene-poison">
        <g className="bg-layer far">{[46, 238, 342].map((x) => <g key={x}><rect x={x} y="92" width="10" height="80" fill="#09040a" /><rect x={x - 18} y="104" width="36" height="6" fill="#09040a" /></g>)}</g>
        <g className="bg-layer mid"><rect x="0" y="158" width="400" height="67" fill="#1a0028" /><g className="mist-scroll">{Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 54} y="142" width="40" height="8" fill="#341050" opacity="0.55" />)}</g></g>
        <g className="bg-layer silhouettes"><g className="ghost-drift-slow" fill="rgba(0,0,0,0.36)"><rect x="86" y="114" width="34" height="26" /><rect x="74" y="122" width="12" height="10" /></g><g className="swalot-bob" fill="rgba(0,0,0,0.38)"><rect x="252" y="136" width="40" height="42" /><rect x="262" y="126" width="20" height="14" /></g></g>
        <g className="bg-layer foreground"><rect x="0" y="190" width="400" height="35" fill="#0b0610" /></g>
        <g className="bg-layer particles">{particleXs.map((x, i) => <circle className="toxic-rise" style={{ animationDelay: `${i * -0.6}s` }} key={x} cx={x} cy={190 - (i % 3) * 16} r="2" fill="#40a000" />)}</g>
    </Svg>
);

const RockScene = () => (
    <Svg base="#0a0800" className="scene-rock">
        <g className="bg-layer far">{Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 56} y="0" width={24 + (i % 3) * 8} height={42 + (i % 4) * 14} fill="#332200" />)}</g>
        <g className="bg-layer mid">{[90, 262, 320].map((x, i) => <g key={x}><rect x={x} y={134 - i * 10} width="24" height="42" fill="#233040" /><rect x={x + 8} y={122 - i * 10} width="8" height="12" fill="#536078" /></g>)}</g>
        <g className="bg-layer silhouettes"><g fill="rgba(0,0,0,0.38)"><rect x="64" y="150" width="44" height="30" /><rect x="76" y="132" width="24" height="22" /></g><g className="onix-glide" fill="rgba(0,0,0,0.34)">{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={236 + i * 18} y={126 + (i % 2) * 10} width="16" height="16" />)}</g></g>
        <g className="bg-layer foreground">{Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 36} y={188 - (i % 3) * 8} width="32" height="22" fill={i % 2 ? '#332200' : '#4a3210'} />)}</g>
        <g className="bg-layer particles">{particleXs.map((x, i) => <rect className="dust-fall" style={{ animationDelay: `${i * -0.5}s` }} key={x} x={x} y={(i * 13) % 110} width="1" height="1" fill="#ffffff" opacity="0.24" />)}</g>
    </Svg>
);

const GroundScene = () => (
    <Svg base="#120900" className="scene-ground">
        <g className="bg-layer far"><rect x="0" y="128" width="400" height="38" fill="#6b4200" /><rect x="0" y="148" width="400" height="77" fill="#8b5a00" /></g>
        <g className="bg-layer mid">{[70, 330].map((x) => <g key={x}><rect x={x} y="132" width="8" height="48" fill="#123814" /><rect x={x - 12} y="148" width="30" height="7" fill="#123814" /></g>)}{[150, 226].map((x) => <rect key={x} x={x} y="160" width="34" height="18" fill="#4a2d00" />)}</g>
        <g className="bg-layer silhouettes"><g className="flygon-shift" fill="rgba(0,0,0,0.32)"><rect x="260" y="82" width="30" height="10" /><polygon points="260,86 230,74 252,102" /></g><g className="sandshrew-scurry" fill="rgba(0,0,0,0.34)"><rect x="40" y="164" width="28" height="16" /><rect x="62" y="158" width="12" height="10" /></g></g>
        <g className="bg-layer foreground"><g className="sand-scroll">{Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 48} y={184 + (i % 2) * 10} width="34" height="3" fill="#c08020" opacity="0.35" />)}</g></g>
        <g className="bg-layer particles">{Array.from({ length: 22 }, (_, i) => <rect className="sand-blow" style={{ animationDelay: `${i * -0.16}s` }} key={i} x={(i * 19) % 400} y={120 + (i * 11) % 84} width="3" height="1" fill="#d0902a" opacity="0.42" />)}</g>
    </Svg>
);

const BugScene = () => (
    <Svg base="#010800" className="scene-bug">
        <g className="bg-layer far">{[0, 42, 328, 370].map((x) => <rect key={x} x={x} y="42" width="30" height="183" fill="#001800" />)}</g>
        <g className="bg-layer mid">{[118, 208, 286].map((x) => <g key={x}><rect x={x} y="158" width="12" height="38" fill="#123814" /><rect x={x - 6} y="150" width="24" height="8" fill="#80ff00" opacity="0.35" /></g>)}</g>
        <g className="bg-layer silhouettes"><g className="butterfree-flutter" fill="rgba(0,0,0,0.32)"><rect x="96" y="84" width="10" height="18" /><rect x="72" y="76" width="24" height="24" /><rect x="106" y="76" width="24" height="24" /></g><g className="beautifly-flutter" fill="rgba(0,0,0,0.3)"><rect x="260" y="102" width="8" height="16" /><rect x="238" y="96" width="22" height="18" /><rect x="268" y="96" width="22" height="18" /></g></g>
        <g className="bg-layer foreground"><rect x="0" y="190" width="400" height="35" fill="#001000" /></g>
        <g className="bg-layer particles">{[40, 76, 132, 190, 238, 318, 366].map((x, i) => <rect className="firefly-blink" style={{ animationDelay: `${i * 0.31}s` }} key={x} x={x} y={60 + (i % 5) * 24} width="2" height="2" fill="#80ff00" />)}{[150, 330].map((x, i) => <rect className="leaf-drift" style={{ animationDelay: `${i * -2}s` }} key={`l${x}`} x={x} y="0" width="2" height="4" fill="#234f18" />)}</g>
    </Svg>
);

const SteelScene = () => (
    <Svg base="#040810" className="scene-steel">
        <g className="bg-layer far"><Stars color="#9aa8b8" accent="#c0c8d0" /><rect x="270" y="62" width="54" height="8" fill="#6a7080" /><rect x="292" y="38" width="8" height="46" fill="#6a7080" /><rect x="248" y="34" width="34" height="34" fill="#303848" /></g>
        <g className="bg-layer mid">{[0, 80, 160, 240, 320].map((x) => <rect key={x} x={x} y="118" width="56" height="8" fill="#1c2430" />)}{Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 64} y={162 - i * 5} width="1" height="63" fill="#1c2430" />)}</g>
        <g className="bg-layer silhouettes"><g fill="rgba(0,0,0,0.38)"><rect x="92" y="144" width="56" height="22" /><rect x="108" y="126" width="24" height="18" /><rect x="74" y="160" width="18" height="10" /></g><g className="aggron-step" fill="rgba(0,0,0,0.36)"><rect x="260" y="124" width="32" height="52" /><rect x="250" y="110" width="48" height="18" /></g></g>
        <g className="bg-layer foreground"><rect x="0" y="184" width="400" height="41" fill="#080c14" /></g>
        <g className="bg-layer particles"><rect className="scan-line" x="0" y="0" width="400" height="3" fill="#7a8494" opacity="0.35" />{[132, 216, 310].map((x, i) => <rect className="spark-fall" style={{ animationDelay: `${i * -0.6}s` }} key={x} x={x} y="130" width="2" height="2" fill="#ffd65a" />)}</g>
    </Svg>
);

const FairyScene = () => (
    <Svg base="#0e0008" className="scene-fairy">
        <g className="bg-layer far"><rect x="300" y="20" width="48" height="48" fill="#301020" opacity="0.72" /><Stars color="#ffb6d8" accent="#ffffff" /></g>
        <g className="bg-layer mid">{[64, 138, 330].map((x) => <g key={x}><rect x={x} y="128" width="10" height="56" fill="#210814" /><rect x={x - 24} y="104" width="58" height="24" fill="#361020" /></g>)}</g>
        <g className="bg-layer silhouettes"><g className="silhouette-bob" fill="rgba(0,0,0,0.32)"><rect x="156" y="128" width="18" height="42" /><rect x="144" y="112" width="42" height="18" /></g><g className="togekiss-glide" fill="rgba(0,0,0,0.3)"><rect x="250" y="92" width="26" height="10" /><polygon points="250,96 220,82 244,108" /><polygon points="276,96 306,82 282,108" /></g></g>
        <g className="bg-layer foreground">{Array.from({ length: 14 }, (_, i) => <g key={i}><rect x={i * 30} y="196" width="2" height="12" fill="#2a0a18" /><rect x={i * 30 - 4} y="192" width="10" height="2" fill={i % 2 ? '#ff69b4' : '#ffffff'} /><rect x={i * 30} y="188" width="2" height="10" fill={i % 2 ? '#ff69b4' : '#ffffff'} /></g>)}</g>
        <g className="bg-layer particles">{[84, 142, 226, 302, 360].map((x, i) => <g className="fairy-spark" style={{ animationDelay: `${i * 0.43}s` }} key={x}><rect x={x + 3} y="78" width="2" height="10" fill="#ffffff" /><rect x={x - 1} y="82" width="10" height="2" fill="#ff69b4" /></g>)}{[60, 252, 340].map((x, i) => <rect className="petal-drift" style={{ animationDelay: `${i * -1.5}s` }} key={`p${x}`} x={x} y="40" width="3" height="3" fill="#ff69b4" />)}</g>
    </Svg>
);

const FlyingScene = () => (
    <Svg base="#00040f" className="scene-flying">
        <g className="bg-layer far"><Stars color="#b8c8e8" accent="#ffffff" /><polygon points="0,176 70,108 138,176" fill="#060b18" /><polygon points="220,178 312,92 400,178" fill="#060b18" /></g>
        <g className="bg-layer mid">{[30, 180, 310].map((x, i) => <g className="cloud-drift" style={{ animationDelay: `${i * -3}s`, animationDuration: `${12 + i * 2}s` }} key={x}><rect x={x} y={62 + i * 32} width="58" height="16" fill="#ffffff" opacity="0.08" /><rect x={x + 20} y={52 + i * 32} width="46" height="16" fill="#ffffff" opacity="0.08" /></g>)}</g>
        <g className="bg-layer silhouettes"><g className="pelipper-glide" fill="rgba(0,0,0,0.32)"><rect x="40" y="76" width="32" height="12" /><polygon points="40,80 4,64 34,96" /><polygon points="72,80 112,64 82,96" /></g><g className="swellow-glide" fill="rgba(0,0,0,0.28)"><rect x="250" y="118" width="18" height="6" /><polygon points="250,120 224,110 246,130" /></g></g>
        <g className="bg-layer foreground"><rect x="0" y="206" width="400" height="19" fill="#02050d" /></g>
        <g className="bg-layer particles">{[44, 126, 236].map((x, i) => <rect className="wind-streak" style={{ animationDelay: `${i * -1.1}s` }} key={x} x={x} y={80 + i * 36} width="74" height="2" fill="rgba(255,255,255,0.06)" />)}</g>
    </Svg>
);

const NormalScene = () => (
    <Svg base="#080810" className="scene-normal">
        <g className="bg-layer far"><Stars /><PixelMoon base="#080810" /></g>
        <g className="bg-layer mid">{[38, 270].map((x, i) => <g key={x}><rect x={x} y="148" width="76" height="42" fill="#111118" /><rect x={x + 12} y="130" width="52" height="20" fill="#1d1d26" /><rect className="window-blink" style={{ animationDelay: `${i * 1.2}s` }} x={x + 18} y="164" width="7" height="6" fill="#ffd25a" /><rect x={x + 48} y="164" width="7" height="6" fill="#ffd25a" /></g>)}</g>
        <g className="bg-layer silhouettes"><g className="eevee-bob" fill="rgba(0,0,0,0.34)"><rect x="130" y="174" width="24" height="14" /><polygon points="134,174 140,160 146,174" /><rect x="154" y="176" width="18" height="5" /></g><g className="zigzagoon-scurries" fill="rgba(0,0,0,0.32)"><rect x="310" y="176" width="30" height="10" /><polygon points="310,176 300,170 306,186" /></g></g>
        <g className="bg-layer foreground"><rect x="184" y="166" width="36" height="59" fill="#181820" /><rect x="0" y="194" width="400" height="31" fill="#05050b" /></g>
        <g className="bg-layer particles">{[66, 204, 356].map((x, i) => <rect className="firefly-blink" style={{ animationDelay: `${i * 0.6}s` }} key={x} x={x} y={126 + i * 12} width="2" height="2" fill="#d8ff78" />)}{[84, 240].map((x, i) => <rect className="leaf-drift" style={{ animationDelay: `${i * -2}s` }} key={`n${x}`} x={x} y="62" width="2" height="4" fill="#3a8a28" />)}</g>
    </Svg>
);

const sceneMap = {
    default: DefaultScene,
    water: WaterScene,
    fire: FireScene,
    grass: GrassScene,
    electric: ElectricScene,
    ice: IceScene,
    psychic: PsychicScene,
    ghost: GhostScene,
    dark: GhostScene,
    dragon: DragonScene,
    fighting: FightingScene,
    poison: PoisonScene,
    rock: RockScene,
    ground: GroundScene,
    bug: BugScene,
    steel: SteelScene,
    fairy: FairyScene,
    flying: FlyingScene,
    normal: NormalScene,
};

const getSceneType = (type) => sceneMap[type] ? type : 'default';

export default function TypeBackground({ currentType }) {
    const nextType = getSceneType(currentType);
    const [activeType, setActiveType] = useState(nextType);
    const [previousType, setPreviousType] = useState('');

    useEffect(() => {
        if (nextType === activeType) return undefined;

        setPreviousType(activeType);
        setActiveType(nextType);

        const timeout = window.setTimeout(() => setPreviousType(''), 520);
        return () => window.clearTimeout(timeout);
    }, [activeType, nextType]);

    const ActiveScene = sceneMap[activeType];
    const PreviousScene = previousType ? sceneMap[previousType] : null;

    return (
        <div id="type-bg">
            {PreviousScene && (
                <div className="type-bg-layer is-exiting" key={`old-${previousType}`}>
                    <PreviousScene />
                </div>
            )}
            <div className="type-bg-layer is-entering" key={activeType}>
                <ActiveScene />
            </div>
        </div>
    );
}

