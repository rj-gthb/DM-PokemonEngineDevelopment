/**
 * GBA-style tile patterns for Pokémon types
 * Each pattern is a 64x64 SVG that tiles smoothly
 * Includes scroll direction and animation properties
 * Designed to scroll subtly across the background without distracting from UI
 */

const createSvgDataUrl = (svgString) => {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml;utf8,${encoded}`;
};

export const typePatterns = {
  default: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#0f172a"/>
      <!-- 2x2 pixel grid pattern, alternating dark squares -->
      <rect x="0" y="0" width="2" height="2" fill="#111827"/>
      <rect x="4" y="0" width="2" height="2" fill="#0d1424"/>
      <rect x="8" y="0" width="2" height="2" fill="#111827"/>
      <rect x="12" y="0" width="2" height="2" fill="#0d1424"/>
      <rect x="16" y="0" width="2" height="2" fill="#111827"/>
      <rect x="20" y="0" width="2" height="2" fill="#0d1424"/>
      <rect x="24" y="0" width="2" height="2" fill="#111827"/>
      <rect x="28" y="0" width="2" height="2" fill="#0d1424"/>
      <rect x="32" y="0" width="2" height="2" fill="#111827"/>
      <rect x="36" y="0" width="2" height="2" fill="#0d1424"/>
      <rect x="40" y="0" width="2" height="2" fill="#111827"/>
      <rect x="44" y="0" width="2" height="2" fill="#0d1424"/>
      <rect x="48" y="0" width="2" height="2" fill="#111827"/>
      <rect x="52" y="0" width="2" height="2" fill="#0d1424"/>
      <rect x="56" y="0" width="2" height="2" fill="#111827"/>
      <rect x="60" y="0" width="2" height="2" fill="#0d1424"/>
      <!-- Repeat for other rows -->
      <rect x="2" y="2" width="2" height="2" fill="#0d1424"/>
      <rect x="6" y="2" width="2" height="2" fill="#111827"/>
      <rect x="10" y="2" width="2" height="2" fill="#0d1424"/>
      <rect x="14" y="2" width="2" height="2" fill="#111827"/>
      <rect x="18" y="2" width="2" height="2" fill="#0d1424"/>
      <rect x="22" y="2" width="2" height="2" fill="#111827"/>
      <rect x="26" y="2" width="2" height="2" fill="#0d1424"/>
      <rect x="30" y="2" width="2" height="2" fill="#111827"/>
      <rect x="34" y="2" width="2" height="2" fill="#0d1424"/>
      <rect x="38" y="2" width="2" height="2" fill="#111827"/>
      <rect x="42" y="2" width="2" height="2" fill="#0d1424"/>
      <rect x="46" y="2" width="2" height="2" fill="#111827"/>
      <rect x="50" y="2" width="2" height="2" fill="#0d1424"/>
      <rect x="54" y="2" width="2" height="2" fill="#111827"/>
      <rect x="58" y="2" width="2" height="2" fill="#0d1424"/>
      <rect x="62" y="2" width="2" height="2" fill="#111827"/>
      <!-- Pattern repeats every 4 pixels -->
      <g id="row4-32">
        <use href="#row0-32" y="4"/>
      </g>
      <g id="row8-32">
        <use href="#row0-32" y="8"/>
      </g>
    </svg>`,
    scrollDirection: 'diagonal',
    opacity: 0.85,
  },
  water: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#0a1a3a"/>
      <!-- Wave pattern - rows of blue -->
      <rect x="0" y="0" width="64" height="4" fill="#0a1a3a"/>
      <rect x="0" y="4" width="64" height="4" fill="#0d2244"/>
      <line x1="0" y1="8" x2="64" y2="8" stroke="#1a3a5a" stroke-width="1"/>
      <rect x="0" y="9" width="64" height="4" fill="#0a1a3a"/>
      <rect x="0" y="13" width="64" height="4" fill="#0d2244"/>
      <line x1="0" y1="17" x2="64" y2="17" stroke="#1a3a5a" stroke-width="1"/>
      <rect x="0" y="18" width="64" height="4" fill="#0a1a3a"/>
      <rect x="0" y="22" width="64" height="4" fill="#0d2244"/>
      <line x1="0" y1="26" x2="64" y2="26" stroke="#1a3a5a" stroke-width="1"/>
      <rect x="0" y="27" width="64" height="4" fill="#0a1a3a"/>
      <rect x="0" y="31" width="64" height="4" fill="#0d2244"/>
      <line x1="0" y1="35" x2="64" y2="35" stroke="#1a3a5a" stroke-width="1"/>
      <rect x="0" y="36" width="64" height="4" fill="#0a1a3a"/>
      <rect x="0" y="40" width="64" height="4" fill="#0d2244"/>
      <line x1="0" y1="44" x2="64" y2="44" stroke="#1a3a5a" stroke-width="1"/>
      <rect x="0" y="45" width="64" height="4" fill="#0a1a3a"/>
      <rect x="0" y="49" width="64" height="4" fill="#0d2244"/>
      <line x1="0" y1="53" x2="64" y2="53" stroke="#1a3a5a" stroke-width="1"/>
      <rect x="0" y="54" width="64" height="4" fill="#0a1a3a"/>
      <rect x="0" y="58" width="64" height="4" fill="#0d2244"/>
      <line x1="0" y1="62" x2="64" y2="62" stroke="#1a3a5a" stroke-width="1"/>
    </svg>`,
    scrollDirection: 'horizontal',
    opacity: 0.85,
  },
  fire: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#1a0500"/>
      <!-- Irregular rock pattern with lava cracks -->
      <rect x="0" y="0" width="4" height="4" fill="#2a0a00"/>
      <rect x="8" y="2" width="3" height="3" fill="#2a0a00"/>
      <rect x="12" y="0" width="5" height="4" fill="#150300"/>
      <rect x="20" y="1" width="4" height="3" fill="#2a0a00"/>
      <rect x="28" y="0" width="6" height="3" fill="#150300"/>
      <rect x="36" y="2" width="4" height="4" fill="#2a0a00"/>
      <rect x="44" y="0" width="5" height="3" fill="#150300"/>
      <rect x="52" y="1" width="4" height="4" fill="#2a0a00"/>
      <rect x="60" y="0" width="4" height="3" fill="#150300"/>
      <!-- Lava crack lines -->
      <line x1="10" y1="10" x2="11" y2="10" stroke="#3a1000" stroke-width="1"/>
      <line x1="26" y1="14" x2="27" y2="14" stroke="#3a1000" stroke-width="1"/>
      <line x1="42" y1="8" x2="43" y2="8" stroke="#3a1000" stroke-width="1"/>
      <line x1="58" y1="12" x2="59" y2="12" stroke="#3a1000" stroke-width="1"/>
      <line x1="18" y1="24" x2="19" y2="24" stroke="#3a1000" stroke-width="1"/>
      <line x1="38" y1="28" x2="39" y2="28" stroke="#3a1000" stroke-width="1"/>
      <!-- Second row -->
      <rect x="4" y="16" width="4" height="4" fill="#2a0a00"/>
      <rect x="14" y="18" width="3" height="3" fill="#150300"/>
      <rect x="24" y="16" width="5" height="4" fill="#2a0a00"/>
      <rect x="36" y="17" width="4" height="3" fill="#150300"/>
      <rect x="48" y="16" width="6" height="4" fill="#2a0a00"/>
      <line x1="6" y1="32" x2="7" y2="32" stroke="#3a1000" stroke-width="1"/>
      <!-- Third row -->
      <rect x="0" y="32" width="4" height="4" fill="#150300"/>
      <rect x="10" y="34" width="3" height="3" fill="#2a0a00"/>
      <rect x="20" y="32" width="5" height="4" fill="#2a0a00"/>
      <rect x="32" y="33" width="4" height="3" fill="#150300"/>
      <rect x="44" y="32" width="6" height="4" fill="#2a0a00"/>
      <rect x="56" y="34" width="4" height="3" fill="#150300"/>
      <line x1="22" y1="44" x2="23" y2="44" stroke="#3a1000" stroke-width="1"/>
      <!-- Fourth row -->
      <rect x="6" y="48" width="4" height="4" fill="#2a0a00"/>
      <rect x="16" y="50" width="3" height="3" fill="#150300"/>
      <rect x="28" y="48" width="5" height="4" fill="#150300"/>
      <rect x="40" y="49" width="4" height="3" fill="#2a0a00"/>
      <rect x="52" y="48" width="6" height="4" fill="#2a0a00"/>
      <line x1="34" y1="58" x2="35" y2="58" stroke="#3a1000" stroke-width="1"/>
    </svg>`,
    scrollDirection: 'vertical',
    opacity: 0.85,
  },
  grass: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#051205"/>
      <!-- Tall grass tile pattern -->
      <rect x="0" y="0" width="8" height="8" fill="#0a1f0a"/>
      <rect x="8" y="0" width="8" height="8" fill="#071507"/>
      <rect x="16" y="0" width="8" height="8" fill="#0a1f0a"/>
      <rect x="24" y="0" width="8" height="8" fill="#071507"/>
      <rect x="32" y="0" width="8" height="8" fill="#0a1f0a"/>
      <rect x="40" y="0" width="8" height="8" fill="#071507"/>
      <rect x="48" y="0" width="8" height="8" fill="#0a1f0a"/>
      <rect x="56" y="0" width="8" height="8" fill="#071507"/>
      <!-- Small grass tuft marks every 16px -->
      <rect x="6" y="4" width="1" height="2" fill="#0d2a0d"/>
      <rect x="22" y="5" width="1" height="2" fill="#0d2a0d"/>
      <rect x="38" y="3" width="1" height="2" fill="#0d2a0d"/>
      <rect x="54" y="6" width="1" height="2" fill="#0d2a0d"/>
      <!-- Row 2 -->
      <rect x="0" y="8" width="8" height="8" fill="#071507"/>
      <rect x="8" y="8" width="8" height="8" fill="#0a1f0a"/>
      <rect x="16" y="8" width="8" height="8" fill="#071507"/>
      <rect x="24" y="8" width="8" height="8" fill="#0a1f0a"/>
      <rect x="32" y="8" width="8" height="8" fill="#071507"/>
      <rect x="40" y="8" width="8" height="8" fill="#0a1f0a"/>
      <rect x="48" y="8" width="8" height="8" fill="#071507"/>
      <rect x="56" y="8" width="8" height="8" fill="#0a1f0a"/>
      <rect x="10" y="12" width="1" height="2" fill="#0d2a0d"/>
      <rect x="26" y="13" width="1" height="2" fill="#0d2a0d"/>
      <rect x="42" y="11" width="1" height="2" fill="#0d2a0d"/>
      <!-- Rows 3-8 (repeat pattern) -->
      <rect x="0" y="16" width="8" height="8" fill="#0a1f0a"/>
      <rect x="8" y="16" width="8" height="8" fill="#071507"/>
      <rect x="16" y="16" width="8" height="8" fill="#0a1f0a"/>
      <rect x="24" y="16" width="8" height="8" fill="#071507"/>
      <rect x="32" y="16" width="8" height="8" fill="#0a1f0a"/>
      <rect x="40" y="16" width="8" height="8" fill="#071507"/>
      <rect x="48" y="16" width="8" height="8" fill="#0a1f0a"/>
      <rect x="56" y="16" width="8" height="8" fill="#071507"/>
      <rect x="6" y="20" width="1" height="2" fill="#0d2a0d"/>
      <rect x="22" y="21" width="1" height="2" fill="#0d2a0d"/>
      <rect x="38" y="19" width="1" height="2" fill="#0d2a0d"/>
      
      <rect x="0" y="24" width="8" height="8" fill="#071507"/>
      <rect x="8" y="24" width="8" height="8" fill="#0a1f0a"/>
      <rect x="16" y="24" width="8" height="8" fill="#071507"/>
      <rect x="24" y="24" width="8" height="8" fill="#0a1f0a"/>
      <rect x="32" y="24" width="8" height="8" fill="#071507"/>
      <rect x="40" y="24" width="8" height="8" fill="#0a1f0a"/>
      <rect x="48" y="24" width="8" height="8" fill="#071507"/>
      <rect x="56" y="24" width="8" height="8" fill="#0a1f0a"/>
      
      <rect x="0" y="32" width="8" height="8" fill="#0a1f0a"/>
      <rect x="8" y="32" width="8" height="8" fill="#071507"/>
      <rect x="16" y="32" width="8" height="8" fill="#0a1f0a"/>
      <rect x="24" y="32" width="8" height="8" fill="#071507"/>
      <rect x="32" y="32" width="8" height="8" fill="#0a1f0a"/>
      <rect x="40" y="32" width="8" height="8" fill="#071507"/>
      <rect x="48" y="32" width="8" height="8" fill="#0a1f0a"/>
      <rect x="56" y="32" width="8" height="8" fill="#071507"/>
      <rect x="10" y="36" width="1" height="2" fill="#0d2a0d"/>
      <rect x="26" y="37" width="1" height="2" fill="#0d2a0d"/>
      
      <rect x="0" y="40" width="8" height="8" fill="#071507"/>
      <rect x="8" y="40" width="8" height="8" fill="#0a1f0a"/>
      <rect x="16" y="40" width="8" height="8" fill="#071507"/>
      <rect x="24" y="40" width="8" height="8" fill="#0a1f0a"/>
      <rect x="32" y="40" width="8" height="8" fill="#071507"/>
      <rect x="40" y="40" width="8" height="8" fill="#0a1f0a"/>
      <rect x="48" y="40" width="8" height="8" fill="#071507"/>
      <rect x="56" y="40" width="8" height="8" fill="#0a1f0a"/>
      
      <rect x="0" y="48" width="8" height="8" fill="#0a1f0a"/>
      <rect x="8" y="48" width="8" height="8" fill="#071507"/>
      <rect x="16" y="48" width="8" height="8" fill="#0a1f0a"/>
      <rect x="24" y="48" width="8" height="8" fill="#071507"/>
      <rect x="32" y="48" width="8" height="8" fill="#0a1f0a"/>
      <rect x="40" y="48" width="8" height="8" fill="#071507"/>
      <rect x="48" y="48" width="8" height="8" fill="#0a1f0a"/>
      <rect x="56" y="48" width="8" height="8" fill="#071507"/>
      <rect x="6" y="52" width="1" height="2" fill="#0d2a0d"/>
      <rect x="22" y="53" width="1" height="2" fill="#0d2a0d"/>
      <rect x="38" y="51" width="1" height="2" fill="#0d2a0d"/>
      <rect x="54" y="54" width="1" height="2" fill="#0d2a0d"/>
      
      <rect x="0" y="56" width="8" height="8" fill="#071507"/>
      <rect x="8" y="56" width="8" height="8" fill="#0a1f0a"/>
      <rect x="16" y="56" width="8" height="8" fill="#071507"/>
      <rect x="24" y="56" width="8" height="8" fill="#0a1f0a"/>
      <rect x="32" y="56" width="8" height="8" fill="#071507"/>
      <rect x="40" y="56" width="8" height="8" fill="#0a1f0a"/>
      <rect x="48" y="56" width="8" height="8" fill="#071507"/>
      <rect x="56" y="56" width="8" height="8" fill="#0a1f0a"/>
    </svg>`,
    scrollDirection: 'diagonal',
    opacity: 0.85,
  },
  electric: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#0d0d00"/>
      <!-- Power plant grid pattern -->
      <line x1="8" y1="0" x2="8" y2="64" stroke="#1a1a00" stroke-width="1"/>
      <line x1="16" y1="0" x2="16" y2="64" stroke="#1a1a00" stroke-width="1"/>
      <line x1="24" y1="0" x2="24" y2="64" stroke="#1a1a00" stroke-width="1"/>
      <line x1="32" y1="0" x2="32" y2="64" stroke="#1a1a00" stroke-width="1"/>
      <line x1="40" y1="0" x2="40" y2="64" stroke="#1a1a00" stroke-width="1"/>
      <line x1="48" y1="0" x2="48" y2="64" stroke="#1a1a00" stroke-width="1"/>
      <line x1="56" y1="0" x2="56" y2="64" stroke="#1a1a00" stroke-width="1"/>
      <line x1="0" y1="8" x2="64" y2="8" stroke="#1a1a00" stroke-width="1"/>
      <line x1="0" y1="16" x2="64" y2="16" stroke="#1a1a00" stroke-width="1"/>
      <line x1="0" y1="24" x2="64" y2="24" stroke="#1a1a00" stroke-width="1"/>
      <line x1="0" y1="32" x2="64" y2="32" stroke="#1a1a00" stroke-width="1"/>
      <line x1="0" y1="40" x2="64" y2="40" stroke="#1a1a00" stroke-width="1"/>
      <line x1="0" y1="48" x2="64" y2="48" stroke="#1a1a00" stroke-width="1"/>
      <line x1="0" y1="56" x2="64" y2="56" stroke="#1a1a00" stroke-width="1"/>
      <!-- Occasional brighter squares -->
      <rect x="16" y="16" width="8" height="8" fill="#2a2a05"/>
      <rect x="40" y="40" width="8" height="8" fill="#2a2a05"/>
      <rect x="8" y="32" width="8" height="8" fill="#2a2a05"/>
      <rect x="48" y="8" width="8" height="8" fill="#2a2a05"/>
    </svg>`,
    scrollDirection: 'slow',
    opacity: 0.85,
  },
  ice: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#050d14"/>
      <!-- Ice tile pattern with cracks -->
      <rect x="0" y="0" width="16" height="16" fill="#0a1520"/>
      <rect x="16" y="0" width="16" height="16" fill="#06101a"/>
      <rect x="32" y="0" width="16" height="16" fill="#0a1520"/>
      <rect x="48" y="0" width="16" height="16" fill="#06101a"/>
      <rect x="0" y="16" width="16" height="16" fill="#06101a"/>
      <rect x="16" y="16" width="16" height="16" fill="#0a1520"/>
      <rect x="32" y="16" width="16" height="16" fill="#06101a"/>
      <rect x="48" y="16" width="16" height="16" fill="#0a1520"/>
      <rect x="0" y="32" width="16" height="16" fill="#0a1520"/>
      <rect x="16" y="32" width="16" height="16" fill="#06101a"/>
      <rect x="32" y="32" width="16" height="16" fill="#0a1520"/>
      <rect x="48" y="32" width="16" height="16" fill="#06101a"/>
      <rect x="0" y="48" width="16" height="16" fill="#06101a"/>
      <rect x="16" y="48" width="16" height="16" fill="#0a1520"/>
      <rect x="32" y="48" width="16" height="16" fill="#06101a"/>
      <rect x="48" y="48" width="16" height="16" fill="#0a1520"/>
      <!-- Diagonal crack lines -->
      <line x1="0" y1="8" x2="8" y2="0" stroke="#0d1f2d" stroke-width="1"/>
      <line x1="16" y1="24" x2="24" y2="16" stroke="#0d1f2d" stroke-width="1"/>
      <line x1="32" y1="40" x2="40" y2="32" stroke="#0d1f2d" stroke-width="1"/>
      <line x1="48" y1="56" x2="56" y2="48" stroke="#0d1f2d" stroke-width="1"/>
      <line x1="8" y1="16" x2="16" y2="8" stroke="#0d1f2d" stroke-width="1"/>
      <line x1="24" y1="32" x2="32" y2="24" stroke="#0d1f2d" stroke-width="1"/>
      <line x1="40" y1="48" x2="48" y2="40" stroke="#0d1f2d" stroke-width="1"/>
    </svg>`,
    scrollDirection: 'veryslow',
    opacity: 0.85,
  },
  psychic: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#0a0014"/>
      <!-- Dream world abstract tiles -->
      <rect x="0" y="0" width="12" height="12" fill="#12001f"/>
      <rect x="12" y="0" width="12" height="12" fill="#08000f"/>
      <rect x="24" y="0" width="12" height="12" fill="#12001f"/>
      <rect x="36" y="0" width="12" height="12" fill="#08000f"/>
      <rect x="48" y="0" width="12" height="12" fill="#12001f"/>
      <rect x="60" y="0" width="4" height="12" fill="#08000f"/>
      <rect x="0" y="12" width="12" height="12" fill="#08000f"/>
      <rect x="12" y="12" width="12" height="12" fill="#12001f"/>
      <rect x="24" y="12" width="12" height="12" fill="#08000f"/>
      <rect x="36" y="12" width="12" height="12" fill="#12001f"/>
      <rect x="48" y="12" width="12" height="12" fill="#08000f"/>
      <rect x="60" y="12" width="4" height="12" fill="#12001f"/>
      <rect x="0" y="24" width="12" height="12" fill="#12001f"/>
      <rect x="12" y="24" width="12" height="12" fill="#08000f"/>
      <rect x="24" y="24" width="12" height="12" fill="#12001f"/>
      <rect x="36" y="24" width="12" height="12" fill="#08000f"/>
      <rect x="48" y="24" width="12" height="12" fill="#12001f"/>
      <rect x="60" y="24" width="4" height="12" fill="#08000f"/>
      <rect x="0" y="36" width="12" height="12" fill="#08000f"/>
      <rect x="12" y="36" width="12" height="12" fill="#12001f"/>
      <rect x="24" y="36" width="12" height="12" fill="#08000f"/>
      <rect x="36" y="36" width="12" height="12" fill="#12001f"/>
      <rect x="48" y="36" width="12" height="12" fill="#08000f"/>
      <rect x="60" y="36" width="4" height="12" fill="#12001f"/>
      <rect x="0" y="48" width="12" height="12" fill="#12001f"/>
      <rect x="12" y="48" width="12" height="12" fill="#08000f"/>
      <rect x="24" y="48" width="12" height="12" fill="#12001f"/>
      <rect x="36" y="48" width="12" height="12" fill="#08000f"/>
      <rect x="48" y="48" width="12" height="12" fill="#12001f"/>
      <rect x="60" y="48" width="4" height="12" fill="#08000f"/>
      <rect x="0" y="60" width="12" height="4" fill="#08000f"/>
      <rect x="12" y="60" width="12" height="4" fill="#12001f"/>
      <rect x="24" y="60" width="12" height="4" fill="#08000f"/>
      <rect x="36" y="60" width="12" height="4" fill="#12001f"/>
      <rect x="48" y="60" width="12" height="4" fill="#08000f"/>
      <rect x="60" y="60" width="4" height="4" fill="#12001f"/>
      <!-- Faint diamond shapes -->
      <polygon points="16,16 20,12 24,16 20,20" fill="#1a0028" opacity="0.5"/>
      <polygon points="48,48 52,44 56,48 52,52" fill="#1a0028" opacity="0.5"/>
    </svg>`,
    scrollDirection: 'diagonal',
    opacity: 0.85,
  },
  ghost: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#04000a"/>
      <!-- Haunted mansion wooden plank pattern -->
      <line x1="0" y1="6" x2="64" y2="6" stroke="#080010" stroke-width="2"/>
      <line x1="0" y1="12" x2="64" y2="12" stroke="#080010" stroke-width="1"/>
      <line x1="0" y1="18" x2="64" y2="18" stroke="#080010" stroke-width="2"/>
      <line x1="0" y1="24" x2="64" y2="24" stroke="#080010" stroke-width="1"/>
      <line x1="0" y1="30" x2="64" y2="30" stroke="#080010" stroke-width="2"/>
      <line x1="0" y1="36" x2="64" y2="36" stroke="#080010" stroke-width="1"/>
      <line x1="0" y1="42" x2="64" y2="42" stroke="#080010" stroke-width="2"/>
      <line x1="0" y1="48" x2="64" y2="48" stroke="#080010" stroke-width="1"/>
      <line x1="0" y1="54" x2="64" y2="54" stroke="#080010" stroke-width="2"/>
      <line x1="0" y1="60" x2="64" y2="60" stroke="#080010" stroke-width="1"/>
      <!-- Alternating plank shading -->
      <rect x="0" y="0" width="64" height="6" fill="#060008"/>
      <rect x="0" y="12" width="64" height="6" fill="#060008"/>
      <rect x="0" y="24" width="64" height="6" fill="#060008"/>
      <rect x="0" y="36" width="64" height="6" fill="#060008"/>
      <rect x="0" y="48" width="64" height="6" fill="#060008"/>
    </svg>`,
    scrollDirection: 'horizontal',
    opacity: 0.85,
  },
  dragon: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#02001a"/>
      <!-- Ancient ruins stone tiles with grout lines -->
      <g>
        <rect x="0" y="0" width="16" height="16" fill="#050028"/>
        <rect x="16" y="0" width="16" height="16" fill="#030020"/>
        <rect x="32" y="0" width="16" height="16" fill="#050028"/>
        <rect x="48" y="0" width="16" height="16" fill="#030020"/>
        <!-- Grout lines -->
        <line x1="16" y1="0" x2="16" y2="16" stroke="#010010" stroke-width="1"/>
        <line x1="32" y1="0" x2="32" y2="16" stroke="#010010" stroke-width="1"/>
        <line x1="48" y1="0" x2="48" y2="16" stroke="#010010" stroke-width="1"/>
        <line x1="0" y1="16" x2="64" y2="16" stroke="#010010" stroke-width="1"/>
      </g>
      <g>
        <rect x="0" y="16" width="16" height="16" fill="#030020"/>
        <rect x="16" y="16" width="16" height="16" fill="#050028"/>
        <rect x="32" y="16" width="16" height="16" fill="#030020"/>
        <rect x="48" y="16" width="16" height="16" fill="#050028"/>
        <line x1="16" y1="16" x2="16" y2="32" stroke="#010010" stroke-width="1"/>
        <line x1="32" y1="16" x2="32" y2="32" stroke="#010010" stroke-width="1"/>
        <line x1="48" y1="16" x2="48" y2="32" stroke="#010010" stroke-width="1"/>
        <line x1="0" y1="32" x2="64" y2="32" stroke="#010010" stroke-width="1"/>
      </g>
      <g>
        <rect x="0" y="32" width="16" height="16" fill="#050028"/>
        <rect x="16" y="32" width="16" height="16" fill="#030020"/>
        <rect x="32" y="32" width="16" height="16" fill="#050028"/>
        <rect x="48" y="32" width="16" height="16" fill="#030020"/>
        <line x1="16" y1="32" x2="16" y2="48" stroke="#010010" stroke-width="1"/>
        <line x1="32" y1="32" x2="32" y2="48" stroke="#010010" stroke-width="1"/>
        <line x1="48" y1="32" x2="48" y2="48" stroke="#010010" stroke-width="1"/>
        <line x1="0" y1="48" x2="64" y2="48" stroke="#010010" stroke-width="1"/>
      </g>
      <g>
        <rect x="0" y="48" width="16" height="16" fill="#030020"/>
        <rect x="16" y="48" width="16" height="16" fill="#050028"/>
        <rect x="32" y="48" width="16" height="16" fill="#030020"/>
        <rect x="48" y="48" width="16" height="16" fill="#050028"/>
        <line x1="16" y1="48" x2="16" y2="64" stroke="#010010" stroke-width="1"/>
        <line x1="32" y1="48" x2="32" y2="64" stroke="#010010" stroke-width="1"/>
        <line x1="48" y1="48" x2="48" y2="64" stroke="#010010" stroke-width="1"/>
        <line x1="0" y1="64" x2="64" y2="64" stroke="#010010" stroke-width="1"/>
      </g>
    </svg>`,
    scrollDirection: 'veryslow',
    opacity: 0.85,
  },
  fighting: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#100000"/>
      <!-- Arena/dojo diagonal wood floor -->
      <line x1="-8" y1="8" x2="72" y2="72" stroke="#180000" stroke-width="8"/>
      <line x1="0" y1="0" x2="64" y2="64" stroke="#180000" stroke-width="8"/>
      <line x1="8" y1="-8" x2="72" y2="56" stroke="#180000" stroke-width="8"/>
      <line x1="16" y1="-8" x2="72" y2="48" stroke="#180000" stroke-width="8"/>
      <line x1="24" y1="-8" x2="72" y2="40" stroke="#180000" stroke-width="8"/>
      <line x1="32" y1="-8" x2="72" y2="32" stroke="#180000" stroke-width="8"/>
      <line x1="40" y1="-8" x2="72" y2="24" stroke="#180000" stroke-width="8"/>
      <!-- Between planks darker -->
      <line x1="-8" y1="16" x2="72" y2="80" stroke="#0d0000" stroke-width="2"/>
      <line x1="0" y1="8" x2="64" y2="72" stroke="#0d0000" stroke-width="2"/>
      <line x1="8" y1="0" x2="64" y2="56" stroke="#0d0000" stroke-width="2"/>
      <line x1="16" y1="0" x2="64" y2="48" stroke="#0d0000" stroke-width="2"/>
      <line x1="24" y1="0" x2="64" y2="40" stroke="#0d0000" stroke-width="2"/>
      <line x1="32" y1="0" x2="64" y2="32" stroke="#0d0000" stroke-width="2"/>
    </svg>`,
    scrollDirection: 'diagonal',
    opacity: 0.85,
  },
  poison: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#05000e"/>
      <!-- Swamp/bog irregular pattern -->
      <polygon points="0,0 8,2 10,10 4,12 2,6" fill="#0a0018"/>
      <polygon points="12,4 20,6 22,14 16,16 14,10" fill="#040010"/>
      <polygon points="24,2 32,4 34,12 28,14 26,8" fill="#0a0018"/>
      <polygon points="36,0 44,2 46,10 40,12 38,6" fill="#040010"/>
      <polygon points="48,4 56,6 58,14 52,16 50,10" fill="#0a0018"/>
      <polygon points="2,18 10,20 12,28 6,30 4,24" fill="#040010"/>
      <polygon points="14,20 22,22 24,30 18,32 16,26" fill="#0a0018"/>
      <polygon points="26,18 34,20 36,28 30,30 28,24" fill="#040010"/>
      <polygon points="38,20 46,22 48,30 42,32 40,26" fill="#0a0018"/>
      <polygon points="50,18 58,20 60,28 54,30 52,24" fill="#040010"/>
      <polygon points="0,36 8,38 10,46 4,48 2,42" fill="#0a0018"/>
      <polygon points="12,38 20,40 22,48 16,50 14,44" fill="#040010"/>
      <polygon points="24,36 32,38 34,46 28,48 26,42" fill="#0a0018"/>
      <polygon points="36,38 44,40 46,48 40,50 38,44" fill="#040010"/>
      <polygon points="48,36 56,38 58,46 52,48 50,42" fill="#0a0018"/>
      <polygon points="2,54 10,56 12,64 6,64 4,60" fill="#040010"/>
      <polygon points="14,56 22,58 24,64 18,64 16,60" fill="#0a0018"/>
      <polygon points="26,54 34,56 36,64 30,64 28,60" fill="#040010"/>
      <polygon points="38,56 46,58 48,64 42,64 40,60" fill="#0a0018"/>
      <polygon points="50,54 58,56 60,64 54,64 52,60" fill="#040010"/>
    </svg>`,
    scrollDirection: 'slow',
    opacity: 0.85,
  },
  rock: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#0a0800"/>
      <!-- Rough stone pattern -->
      <polygon points="0,0 6,2 8,8 2,10" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="10,0 16,2 18,8 12,10" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="20,0 26,2 28,8 22,10" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="30,0 36,2 38,8 32,10" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="40,0 46,2 48,8 42,10" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="50,0 56,2 58,8 52,10" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="2,12 8,14 10,20 4,22" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="12,12 18,14 20,20 14,22" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="22,12 28,14 30,20 24,22" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="32,12 38,14 40,20 34,22" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="42,12 48,14 50,20 44,22" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="52,12 58,14 60,20 54,22" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="0,24 6,26 8,32 2,34" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="10,24 16,26 18,32 12,34" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="20,24 26,26 28,32 22,34" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="30,24 36,26 38,32 32,34" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="40,24 46,26 48,32 42,34" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="50,24 56,26 58,32 52,34" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="2,36 8,38 10,44 4,46" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="12,36 18,38 20,44 14,46" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="22,36 28,38 30,44 24,46" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="32,36 38,38 40,44 34,46" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="42,36 48,38 50,44 44,46" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="52,36 58,38 60,44 54,46" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="0,48 6,50 8,56 2,58" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="10,48 16,50 18,56 12,58" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="20,48 26,50 28,56 22,58" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="30,48 36,50 38,56 32,58" fill="#080600" stroke="#120f00" stroke-width="1"/>
      <polygon points="40,48 46,50 48,56 42,58" fill="#120f00" stroke="#080600" stroke-width="1"/>
      <polygon points="50,48 56,50 58,56 52,58" fill="#080600" stroke="#120f00" stroke-width="1"/>
    </svg>`,
    scrollDirection: 'veryslow',
    opacity: 0.85,
  },
  ground: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#120900"/>
      <!-- Desert/sand ripple pattern -->
      <line x1="0" y1="4" x2="64" y2="4" stroke="#1a0e00" stroke-width="1"/>
      <line x1="0" y1="8" x2="64" y2="8" stroke="#0f0700" stroke-width="1"/>
      <line x1="0" y1="12" x2="64" y2="12" stroke="#1a0e00" stroke-width="1"/>
      <line x1="0" y1="16" x2="64" y2="16" stroke="#0f0700" stroke-width="1"/>
      <line x1="0" y1="20" x2="64" y2="20" stroke="#1a0e00" stroke-width="1"/>
      <line x1="0" y1="24" x2="64" y2="24" stroke="#0f0700" stroke-width="1"/>
      <line x1="0" y1="28" x2="64" y2="28" stroke="#1a0e00" stroke-width="1"/>
      <line x1="0" y1="32" x2="64" y2="32" stroke="#0f0700" stroke-width="1"/>
      <line x1="0" y1="36" x2="64" y2="36" stroke="#1a0e00" stroke-width="1"/>
      <line x1="0" y1="40" x2="64" y2="40" stroke="#0f0700" stroke-width="1"/>
      <line x1="0" y1="44" x2="64" y2="44" stroke="#1a0e00" stroke-width="1"/>
      <line x1="0" y1="48" x2="64" y2="48" stroke="#0f0700" stroke-width="1"/>
      <line x1="0" y1="52" x2="64" y2="52" stroke="#1a0e00" stroke-width="1"/>
      <line x1="0" y1="56" x2="64" y2="56" stroke="#0f0700" stroke-width="1"/>
      <line x1="0" y1="60" x2="64" y2="60" stroke="#1a0e00" stroke-width="1"/>
    </svg>`,
    scrollDirection: 'rightward',
    opacity: 0.85,
  },
  bug: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#010800"/>
      <!-- Forest floor leaf litter pattern -->
      <polygon points="2,2 5,0 7,3 4,5" fill="#020f00" opacity="0.8"/>
      <polygon points="14,6 17,4 19,7 16,9" fill="#010a00" opacity="0.75"/>
      <polygon points="28,4 31,2 33,5 30,7" fill="#020f00" opacity="0.8"/>
      <polygon points="42,8 45,6 47,9 44,11" fill="#010a00" opacity="0.75"/>
      <polygon points="56,2 59,0 61,3 58,5" fill="#020f00" opacity="0.8"/>
      <polygon points="6,18 9,16 11,19 8,21" fill="#010a00" opacity="0.75"/>
      <polygon points="20,16 23,14 25,17 22,19" fill="#020f00" opacity="0.8"/>
      <polygon points="34,20 37,18 39,21 36,23" fill="#010a00" opacity="0.75"/>
      <polygon points="50,18 53,16 55,19 52,21" fill="#020f00" opacity="0.8"/>
      <polygon points="8,32 11,30 13,33 10,35" fill="#020f00" opacity="0.8"/>
      <polygon points="22,34 25,32 27,35 24,37" fill="#010a00" opacity="0.75"/>
      <polygon points="36,32 39,30 41,33 38,35" fill="#020f00" opacity="0.8"/>
      <polygon points="52,36 55,34 57,37 54,39" fill="#010a00" opacity="0.75"/>
      <polygon points="4,48 7,46 9,49 6,51" fill="#010a00" opacity="0.75"/>
      <polygon points="18,50 21,48 23,51 20,53" fill="#020f00" opacity="0.8"/>
      <polygon points="32,48 35,46 37,49 34,51" fill="#010a00" opacity="0.75"/>
      <polygon points="46,52 49,50 51,53 48,55" fill="#020f00" opacity="0.8"/>
      <polygon points="60,50 63,48 65,51 62,53" fill="#010a00" opacity="0.75"/>
    </svg>`,
    scrollDirection: 'diagonal',
    opacity: 0.85,
  },
  steel: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#040810"/>
      <!-- Metal floor grid pattern -->
      <line x1="12" y1="0" x2="12" y2="64" stroke="#080f1a" stroke-width="1"/>
      <line x1="24" y1="0" x2="24" y2="64" stroke="#080f1a" stroke-width="1"/>
      <line x1="36" y1="0" x2="36" y2="64" stroke="#080f1a" stroke-width="1"/>
      <line x1="48" y1="0" x2="48" y2="64" stroke="#080f1a" stroke-width="1"/>
      <line x1="60" y1="0" x2="60" y2="64" stroke="#080f1a" stroke-width="1"/>
      <line x1="0" y1="12" x2="64" y2="12" stroke="#080f1a" stroke-width="1"/>
      <line x1="0" y1="24" x2="64" y2="24" stroke="#080f1a" stroke-width="1"/>
      <line x1="0" y1="36" x2="64" y2="36" stroke="#080f1a" stroke-width="1"/>
      <line x1="0" y1="48" x2="64" y2="48" stroke="#080f1a" stroke-width="1"/>
      <line x1="0" y1="60" x2="64" y2="60" stroke="#080f1a" stroke-width="1"/>
      <!-- Panel squares with subtle borders -->
      <rect x="2" y="2" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="14" y="14" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="26" y="2" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="38" y="14" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="50" y="2" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="2" y="26" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="14" y="38" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="26" y="26" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="38" y="38" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="50" y="26" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="2" y="50" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="14" y="50" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="26" y="50" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="38" y="50" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
      <rect x="50" y="50" width="10" height="10" fill="#060c14" stroke="#0a1020" stroke-width="1"/>
    </svg>`,
    scrollDirection: 'veryslow',
    opacity: 0.85,
  },
  fairy: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#0e0008"/>
      <!-- Enchanted meadow tile pattern -->
      <rect x="0" y="0" width="16" height="16" fill="#150010"/>
      <rect x="16" y="0" width="16" height="16" fill="#0a0006"/>
      <rect x="32" y="0" width="16" height="16" fill="#150010"/>
      <rect x="48" y="0" width="16" height="16" fill="#0a0006"/>
      <rect x="0" y="16" width="16" height="16" fill="#0a0006"/>
      <rect x="16" y="16" width="16" height="16" fill="#150010"/>
      <rect x="32" y="16" width="16" height="16" fill="#0a0006"/>
      <rect x="48" y="16" width="16" height="16" fill="#150010"/>
      <rect x="0" y="32" width="16" height="16" fill="#150010"/>
      <rect x="16" y="32" width="16" height="16" fill="#0a0006"/>
      <rect x="32" y="32" width="16" height="16" fill="#150010"/>
      <rect x="48" y="32" width="16" height="16" fill="#0a0006"/>
      <rect x="0" y="48" width="16" height="16" fill="#0a0006"/>
      <rect x="16" y="48" width="16" height="16" fill="#150010"/>
      <rect x="32" y="48" width="16" height="16" fill="#0a0006"/>
      <rect x="48" y="48" width="16" height="16" fill="#150010"/>
      <!-- Tiny flower marks -->
      <g fill="#1f0015" opacity="0.6">
        <polygon points="8,8 9,7 10,8 9,9"/>
        <polygon points="24,12 25,11 26,12 25,13"/>
        <polygon points="40,8 41,7 42,8 41,9"/>
        <polygon points="56,12 57,11 58,12 57,13"/>
        <polygon points="12,24 13,23 14,24 13,25"/>
        <polygon points="28,28 29,27 30,28 29,29"/>
        <polygon points="44,24 45,23 46,24 45,25"/>
        <polygon points="8,40 9,39 10,40 9,41"/>
        <polygon points="24,44 25,43 26,44 25,45"/>
        <polygon points="40,40 41,39 42,40 41,41"/>
        <polygon points="56,44 57,43 58,44 57,45"/>
        <polygon points="12,56 13,55 14,56 13,57"/>
        <polygon points="28,60 29,59 30,60 29,61"/>
        <polygon points="44,56 45,55 46,56 45,57"/>
      </g>
    </svg>`,
    scrollDirection: 'diagonal',
    opacity: 0.85,
  },
  flying: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#00040f"/>
      <!-- Sky/cloud wisps pattern -->
      <ellipse cx="8" cy="12" rx="8" ry="5" fill="#000814" opacity="0.6"/>
      <ellipse cx="20" cy="8" rx="10" ry="6" fill="#000610" opacity="0.5"/>
      <ellipse cx="36" cy="14" rx="9" ry="5" fill="#000814" opacity="0.6"/>
      <ellipse cx="52" cy="10" rx="8" ry="6" fill="#000610" opacity="0.5"/>
      <ellipse cx="14" cy="28" rx="10" ry="5" fill="#000610" opacity="0.55"/>
      <ellipse cx="32" cy="32" rx="9" ry="6" fill="#000814" opacity="0.6"/>
      <ellipse cx="50" cy="28" rx="8" ry="5" fill="#000610" opacity="0.5"/>
      <ellipse cx="6" cy="44" rx="9" ry="6" fill="#000814" opacity="0.6"/>
      <ellipse cx="24" cy="48" rx="8" ry="5" fill="#000610" opacity="0.55"/>
      <ellipse cx="42" cy="46" rx="10" ry="6" fill="#000814" opacity="0.6"/>
      <ellipse cx="58" cy="50" rx="8" ry="5" fill="#000610" opacity="0.5"/>
      <ellipse cx="12" cy="62" rx="9" ry="4" fill="#000814" opacity="0.5"/>
      <ellipse cx="32" cy="58" rx="8" ry="5" fill="#000610" opacity="0.55"/>
      <ellipse cx="52" cy="60" rx="9" ry="4" fill="#000814" opacity="0.5"/>
    </svg>`,
    scrollDirection: 'rightward',
    opacity: 0.85,
  },
  normal: {
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#080810"/>
      <!-- Simple dirt path grid -->
      <rect x="0" y="0" width="8" height="8" fill="#0d0d18"/>
      <rect x="8" y="0" width="8" height="8" fill="#060610"/>
      <rect x="16" y="0" width="8" height="8" fill="#0d0d18"/>
      <rect x="24" y="0" width="8" height="8" fill="#060610"/>
      <rect x="32" y="0" width="8" height="8" fill="#0d0d18"/>
      <rect x="40" y="0" width="8" height="8" fill="#060610"/>
      <rect x="48" y="0" width="8" height="8" fill="#0d0d18"/>
      <rect x="56" y="0" width="8" height="8" fill="#060610"/>
      <rect x="0" y="8" width="8" height="8" fill="#060610"/>
      <rect x="8" y="8" width="8" height="8" fill="#0d0d18"/>
      <rect x="16" y="8" width="8" height="8" fill="#060610"/>
      <rect x="24" y="8" width="8" height="8" fill="#0d0d18"/>
      <rect x="32" y="8" width="8" height="8" fill="#060610"/>
      <rect x="40" y="8" width="8" height="8" fill="#0d0d18"/>
      <rect x="48" y="8" width="8" height="8" fill="#060610"/>
      <rect x="56" y="8" width="8" height="8" fill="#0d0d18"/>
      <rect x="0" y="16" width="8" height="8" fill="#0d0d18"/>
      <rect x="8" y="16" width="8" height="8" fill="#060610"/>
      <rect x="16" y="16" width="8" height="8" fill="#0d0d18"/>
      <rect x="24" y="16" width="8" height="8" fill="#060610"/>
      <rect x="32" y="16" width="8" height="8" fill="#0d0d18"/>
      <rect x="40" y="16" width="8" height="8" fill="#060610"/>
      <rect x="48" y="16" width="8" height="8" fill="#0d0d18"/>
      <rect x="56" y="16" width="8" height="8" fill="#060610"/>
      <rect x="0" y="24" width="8" height="8" fill="#060610"/>
      <rect x="8" y="24" width="8" height="8" fill="#0d0d18"/>
      <rect x="16" y="24" width="8" height="8" fill="#060610"/>
      <rect x="24" y="24" width="8" height="8" fill="#0d0d18"/>
      <rect x="32" y="24" width="8" height="8" fill="#060610"/>
      <rect x="40" y="24" width="8" height="8" fill="#0d0d18"/>
      <rect x="48" y="24" width="8" height="8" fill="#060610"/>
      <rect x="56" y="24" width="8" height="8" fill="#0d0d18"/>
      <rect x="0" y="32" width="8" height="8" fill="#0d0d18"/>
      <rect x="8" y="32" width="8" height="8" fill="#060610"/>
      <rect x="16" y="32" width="8" height="8" fill="#0d0d18"/>
      <rect x="24" y="32" width="8" height="8" fill="#060610"/>
      <rect x="32" y="32" width="8" height="8" fill="#0d0d18"/>
      <rect x="40" y="32" width="8" height="8" fill="#060610"/>
      <rect x="48" y="32" width="8" height="8" fill="#0d0d18"/>
      <rect x="56" y="32" width="8" height="8" fill="#060610"/>
      <rect x="0" y="40" width="8" height="8" fill="#060610"/>
      <rect x="8" y="40" width="8" height="8" fill="#0d0d18"/>
      <rect x="16" y="40" width="8" height="8" fill="#060610"/>
      <rect x="24" y="40" width="8" height="8" fill="#0d0d18"/>
      <rect x="32" y="40" width="8" height="8" fill="#060610"/>
      <rect x="40" y="40" width="8" height="8" fill="#0d0d18"/>
      <rect x="48" y="40" width="8" height="8" fill="#060610"/>
      <rect x="56" y="40" width="8" height="8" fill="#0d0d18"/>
      <rect x="0" y="48" width="8" height="8" fill="#0d0d18"/>
      <rect x="8" y="48" width="8" height="8" fill="#060610"/>
      <rect x="16" y="48" width="8" height="8" fill="#0d0d18"/>
      <rect x="24" y="48" width="8" height="8" fill="#060610"/>
      <rect x="32" y="48" width="8" height="8" fill="#0d0d18"/>
      <rect x="40" y="48" width="8" height="8" fill="#060610"/>
      <rect x="48" y="48" width="8" height="8" fill="#0d0d18"/>
      <rect x="56" y="48" width="8" height="8" fill="#060610"/>
      <rect x="0" y="56" width="8" height="8" fill="#060610"/>
      <rect x="8" y="56" width="8" height="8" fill="#0d0d18"/>
      <rect x="16" y="56" width="8" height="8" fill="#060610"/>
      <rect x="24" y="56" width="8" height="8" fill="#0d0d18"/>
      <rect x="32" y="56" width="8" height="8" fill="#060610"/>
      <rect x="40" y="56" width="8" height="8" fill="#0d0d18"/>
      <rect x="48" y="56" width="8" height="8" fill="#060610"/>
      <rect x="56" y="56" width="8" height="8" fill="#0d0d18"/>
    </svg>`,
    scrollDirection: 'diagonal',
    opacity: 0.85,
  },
};

// Get pattern for a type, with fallback
export const getPatternForType = (type) => {
  return typePatterns[type] || typePatterns.default;
};

// Convert scroll direction to CSS animation values
export const getScrollAnimation = (direction) => {
  const animations = {
    diagonal: '64px 64px',
    horizontal: '64px 0',
    vertical: '0 64px',
    rightward: '64px 0',
    slow: '64px 64px',
    veryslow: '64px 64px',
  };
  return animations[direction] || animations.diagonal;
};

// Get animation duration based on scroll direction
export const getAnimationDuration = (direction) => {
  const durations = {
    diagonal: '60s',
    horizontal: '60s',
    vertical: '50s',
    rightward: '55s',
    slow: '75s',
    veryslow: '90s',
  };
  return durations[direction] || '60s';
};

// Create background style object for a given type
export const getBackgroundStyleForType = (type) => {
  const pattern = getPatternForType(type);
  const scrollDir = pattern.scrollDirection;
  const duration = getAnimationDuration(scrollDir);
  const bgPos = getScrollAnimation(scrollDir);

  return {
    backgroundImage: `url("${createSvgDataUrl(pattern.svg)}")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '64px 64px',
    backgroundAttachment: 'fixed',
    opacity: 0.85,
    animation: `scrollTile-${scrollDir} ${duration} linear infinite`,
  };
};
