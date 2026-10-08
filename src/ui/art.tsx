export function GwenPortrait() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="gw-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0" stop-color="#4a3a7a" />
          <stop offset="1" stop-color="#1c1630" />
        </radialGradient>
        <radialGradient id="gw-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#d9b6ff" stop-opacity="0.9" />
          <stop offset="1" stop-color="#a66cff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" fill="url(#gw-bg)" />
      <path d="M60 18 C34 18 26 50 28 74 L32 112 L88 112 L92 74 C94 50 86 18 60 18 Z" fill="#3b2d66" />
      <path d="M60 24 C40 24 34 50 36 70 L38 96 L82 96 L84 70 C86 50 80 24 60 24 Z" fill="#2a2049" />
      <ellipse cx="60" cy="58" rx="17" ry="21" fill="#f1d9c4" />
      <path d="M43 56 C43 36 77 36 77 56 C77 46 70 40 60 40 C50 40 43 46 43 56 Z" fill="#1a1426" />
      <path d="M43 56 L41 80 L47 80 L48 60 Z" fill="#1a1426" />
      <path d="M77 56 L79 80 L73 80 L72 60 Z" fill="#1a1426" />
      <circle cx="53" cy="60" r="1.8" fill="#2a1f3a" />
      <circle cx="67" cy="60" r="1.8" fill="#2a1f3a" />
      <path d="M55 70 Q60 73 65 70" stroke="#b0705f" stroke-width="1.4" fill="none" stroke-linecap="round" />
      <circle cx="66" cy="38" r="2.2" fill="#c9a227" />
      <path d="M64 30 L70 26 L72 34 Z" fill="#c23b4a" />
      <circle cx="84" cy="96" r="18" fill="url(#gw-glow)" />
      <path d="M84 84 L91 94 L84 108 L77 94 Z" fill="#c9a8ff" stroke="#f3e9ff" stroke-width="1" />
      <path d="M84 84 L84 108" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1" />
      <path d="M30 112 Q60 100 90 112" fill="#c9a227" opacity="0.7" />
    </svg>
  )
}

export function Crystal({ level }: { level: number }) {
  const glow = 0.15 + level * 0.85
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="cr-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0" stop-color="#e2c8ff" stop-opacity={glow} />
          <stop offset="1" stop-color="#a66cff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="64" r="56" fill="url(#cr-glow)" />
      <path d="M60 14 L84 50 L60 110 L36 50 Z" fill="#b48cff" stroke="#f3e9ff" stroke-width="2" />
      <path d="M60 14 L60 110" stroke="#fff" stroke-opacity="0.45" stroke-width="2" />
      <path d="M36 50 L84 50" stroke="#fff" stroke-opacity="0.35" stroke-width="2" />
      <path d="M60 14 L48 50 L60 110" fill="#d8c4ff" opacity={0.35 + level * 0.5} />
    </svg>
  )
}

export function CoinDisc({ size = 180 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} class="title-coin" aria-hidden="true">
      <defs>
        <radialGradient id="cd-gold" cx="38%" cy="32%" r="75%">
          <stop offset="0" stop-color="#f6e39a" />
          <stop offset="0.6" stop-color="#c9a227" />
          <stop offset="1" stop-color="#7a5a0e" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#cd-gold)" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#8a6a14" stroke-width="2" stroke-dasharray="1.5 4" />
      <path
        d="M84 152 C80 136 82 122 78 112 C70 110 64 104 66 96 C60 92 60 86 66 84 C62 76 62 66 68 58 C76 46 94 42 108 48 C120 54 126 66 124 78 C130 82 134 90 130 96 C134 100 132 108 126 110 C128 120 124 130 118 134 C116 142 118 148 120 152 Z"
        fill="#8a6a14"
        opacity="0.9"
      />
      <path
        d="M70 60 C78 46 100 44 112 52 C122 60 124 72 120 80 C116 74 108 70 102 72 C96 66 86 66 80 72 C76 66 72 62 70 60 Z"
        fill="#6a5010"
      />
      <path d="M62 52 C74 36 100 30 118 40 C128 46 134 58 134 70" fill="none" stroke="#5a4208" stroke-width="5" stroke-linecap="round" />
      <path d="M60 58 l-6 -8 M70 46 l-8 -7 M84 38 l-6 -9 M100 34 l-2 -10 M116 36 l2 -10 M130 46 l6 -8" stroke="#5a4208" stroke-width="3" stroke-linecap="round" />
      <text x="100" y="182" text-anchor="middle" font-family="Cinzel, serif" font-size="16" fill="#5a4208" letter-spacing="4">MONETA</text>
    </svg>
  )
}

export function VillageScene({ terrain = 'meadow' }: { terrain?: string }) {
  const sky = terrain === 'desert' ? '#f3d9a4' : terrain === 'coast' ? '#cfe3ee' : '#d9e4ea'
  const ground = terrain === 'desert' ? '#d8b878' : terrain === 'coast' ? '#8fb08a' : terrain === 'forest' ? '#3f5a35' : terrain === 'city' ? '#a89f86' : '#6f8f55'
  return (
    <svg viewBox="0 0 1200 300" class="scene" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1200" height="300" fill={sky} />
      <ellipse cx="200" cy="300" rx="420" ry="120" fill={shade(ground, -8)} />
      <ellipse cx="900" cy="310" rx="520" ry="140" fill={shade(ground, -14)} />
      <rect y="220" width="1200" height="80" fill={ground} />
      {terrain === 'meadow' && (
        <g>
          <Tent x={240} y={190} color="#b3845a" />
          <Tent x={880} y={200} color="#9a6e4a" />
          <Statue x={600} y={150} />
          <Tree x={120} y={160} />
          <Tree x={1060} y={150} />
        </g>
      )}
      {terrain === 'camp' && (
        <g>
          <rect x="300" y="150" width="600" height="70" fill="#8a7352" />
          <rect x="300" y="140" width="600" height="14" fill="#5d4b32" />
          {[320, 420, 520, 620, 720, 820].map((x) => (
            <rect x={x} y="128" width="40" height="22" fill="#5d4b32" />
          ))}
          <rect x="570" y="160" width="60" height="60" fill="#3a2c1a" />
          <Tent x={160} y={200} color="#9a6e4a" />
          <Tent x={1020} y={200} color="#9a6e4a" />
        </g>
      )}
      {terrain === 'river' && (
        <g>
          <path d="M0 230 C300 200 500 260 800 225 C1000 205 1100 240 1200 232 L1200 300 L0 300 Z" fill="#5b86a3" />
          <path d="M0 240 C300 210 500 270 800 235 C1000 215 1100 250 1200 242" fill="none" stroke="#9cc2d6" stroke-width="3" opacity="0.6" />
          <rect x="420" y="140" width="360" height="60" fill="#8a7352" />
          <rect x="420" y="130" width="360" height="14" fill="#5d4b32" />
          <Tree x={140} y={150} />
          <Tree x={1040} y={140} />
        </g>
      )}
      {terrain === 'desert' && (
        <g>
          <circle cx="980" cy="70" r="36" fill="#fff1c2" />
          {[300, 360, 420, 480].map((x) => (
            <g>
              <rect x={x} y="120" width="22" height="100" fill="#efe4c8" />
              <rect x={x - 6} y="112" width="34" height="12" fill="#e2d4b2" />
            </g>
          ))}
          <rect x="280" y="100" width="230" height="16" fill="#e2d4b2" />
          <path d="M700 220 L760 150 L820 220 Z" fill="#d6c195" />
          <path d="M860 220 L900 170 L940 220 Z" fill="#cdb886" />
        </g>
      )}
      {terrain === 'forest' && (
        <g>
          {[60, 180, 300, 760, 900, 1040, 1140].map((x, i) => (
            <Tree x={x} y={120 + (i % 3) * 20} scale={1.3} dark />
          ))}
          <rect x="470" y="150" width="260" height="70" fill="#8a7352" />
          <path d="M460 152 L600 95 L740 152 Z" fill="#6d3f2f" />
        </g>
      )}
      {terrain === 'city' && (
        <g>
          <rect x="200" y="110" width="800" height="110" fill="#c9bb9c" />
          {[240, 340, 440, 540, 640, 740, 840, 920].map((x) => (
            <path d={`M${x} 220 L${x} 150 A20 20 0 0 1 ${x + 40} 150 L${x + 40} 220 Z`} fill="#8a7a5c" />
          ))}
          <rect x="190" y="98" width="820" height="14" fill="#a89a7c" />
          <path d="M540 98 L600 50 L660 98 Z" fill="#a89a7c" />
        </g>
      )}
      {terrain === 'coast' && (
        <g>
          <rect y="200" width="1200" height="60" fill="#4f7f9e" />
          <path d="M0 212 Q100 204 200 212 T400 212 T600 212 T800 212 T1000 212 T1200 212" fill="none" stroke="#9cc2d6" stroke-width="3" opacity="0.6" />
          <rect x="420" y="90" width="360" height="110" fill="#d9cfb5" />
          <path d="M600 30 L560 90 L640 90 Z" fill="#b89a5c" />
          <circle cx="600" cy="60" r="34" fill="#c9a227" opacity="0.9" />
          <path d="M860 200 L880 140 L900 200 Z" fill="#e6dcc3" />
          <path d="M900 200 L920 150 L940 200 Z" fill="#e6dcc3" />
        </g>
      )}
    </svg>
  )
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount))
  const b = Math.max(0, Math.min(255, (n & 255) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function Tent({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <path d={`M${x - 70} ${y + 40} L${x} ${y - 60} L${x + 70} ${y + 40} Z`} fill={color} />
      <path d={`M${x - 14} ${y + 40} L${x} ${y - 10} L${x + 14} ${y + 40} Z`} fill="#3a2c1a" />
    </g>
  )
}

function Tree({ x, y, scale = 1, dark = false }: { x: number; y: number; scale?: number; dark?: boolean }) {
  const c = dark ? '#2f4a2a' : '#4a7a3c'
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-6" y="40" width="12" height="40" fill="#5d4b32" />
      <ellipse cx="0" cy="20" rx="40" ry="44" fill={c} />
      <ellipse cx="-12" cy="4" rx="24" ry="26" fill={shade(c, 18)} />
    </g>
  )
}

function Statue({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-30" y="56" width="60" height="16" fill="#b8b0a0" />
      <rect x="-20" y="40" width="40" height="18" fill="#cfc7b6" />
      <path d="M0 -40 C-14 -40 -18 -24 -18 -12 L-14 40 L14 40 L18 -12 C18 -24 14 -40 0 -40 Z" fill="#e6e0d2" />
      <circle cx="0" cy="-44" r="10" fill="#e6e0d2" />
      <path d="M-18 -12 L-30 10 M18 -12 L30 10" stroke="#e6e0d2" stroke-width="6" stroke-linecap="round" />
    </g>
  )
}

export function IconCodex() {
  return (
    <svg viewBox="0 0 48 48" class="icon" aria-hidden="true">
      <path d="M8 8 h14 a4 4 0 0 1 4 4 v28 a4 4 0 0 0 -4 -4 H8 Z" fill="#f3e9d2" />
      <path d="M40 8 h-14 a4 4 0 0 0 -4 4 v28 a4 4 0 0 1 4 -4 h14 Z" fill="#e5d5b2" />
      <path d="M8 8 v28 M40 8 v28" stroke="#8a6a14" stroke-width="2" fill="none" />
    </svg>
  )
}

export function IconCabinet() {
  return (
    <svg viewBox="0 0 48 48" class="icon" aria-hidden="true">
      <rect x="6" y="8" width="36" height="32" rx="3" fill="#5d4b32" />
      {[12, 24, 36].map((x) =>
        [16, 30].map((y) => <circle cx={x} cy={y} r="5" fill="#c9a227" stroke="#7a5a0e" stroke-width="1" />),
      )}
    </svg>
  )
}

export function IconPractice() {
  return (
    <svg viewBox="0 0 48 48" class="icon" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="none" stroke="#c9a227" stroke-width="3" />
      <circle cx="24" cy="24" r="10" fill="none" stroke="#c9a227" stroke-width="3" />
      <circle cx="24" cy="24" r="3" fill="#c9a227" />
    </svg>
  )
}

export function IconDig() {
  return (
    <svg viewBox="0 0 48 48" class="icon" aria-hidden="true">
      <path d="M10 38 L30 18" stroke="#8a6a14" stroke-width="4" stroke-linecap="round" />
      <path d="M28 10 l10 10 l-6 6 l-10 -10 z" fill="#b9bcc2" stroke="#5a4a38" stroke-width="2" />
    </svg>
  )
}
