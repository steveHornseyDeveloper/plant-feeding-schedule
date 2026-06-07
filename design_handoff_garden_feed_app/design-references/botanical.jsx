// Botanical decoration primitives — simple shapes only (per design rules).
// Used by both directions to build watercolor washes, drystone-wall motifs,
// and plant badges. Nothing complex; lots of layered ellipses + rects.

// Soft watercolor blob — overlapping radial gradients on a few ellipses.
function Watercolor({ color = '#7aa67a', opacity = 0.35, seed = 1, style = {} }) {
  const r = (a, b) => a + ((seed * 9301 + 49297) % 233280) / 233280 * (b - a);
  const id = `wc${seed}-${color.replace('#','')}`;
  return (
    <svg viewBox="0 0 200 200" style={style} preserveAspectRatio="none">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity}/>
          <stop offset="60%" stopColor={color} stopOpacity={opacity * 0.5}/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx={100 + r(-15, 15)} cy={100 + r(-15, 15)} rx={r(70, 95)} ry={r(70, 95)} fill={`url(#${id})`}/>
      <ellipse cx={100 + r(-25, 25)} cy={100 + r(-25, 25)} rx={r(45, 65)} ry={r(45, 65)} fill={`url(#${id})`}/>
      <ellipse cx={100 + r(-30, 30)} cy={100 + r(-30, 30)} rx={r(30, 50)} ry={r(30, 50)} fill={`url(#${id})`}/>
    </svg>
  );
}

// Drystone wall — irregular stacked rectangles with limestone tones.
// Used as a divider, footer texture, or sidebar.
function Drystone({ rows = 3, w = 320, h = 36, intensity = 1, style = {} }) {
  // Deterministic pseudo-random based on x/y so reload looks the same.
  const stones = [];
  let y = 0;
  for (let r = 0; r < rows; r++) {
    const rowH = h / rows;
    let x = -10 + ((r % 2) * (rowH * 0.6)); // brick offset
    while (x < w + 10) {
      const sw = 18 + ((Math.sin(r * 7.13 + x * 0.071) + 1) * 22);
      const sh = rowH - 1.5;
      const tone = 0.78 + (Math.sin(r * 3.7 + x * 0.09) * 0.07);
      const tilt = (Math.sin(r * 5 + x * 0.13) * 1.5) * intensity;
      stones.push({ x, y: y + tilt, w: sw, h: sh, tone, key: `${r}-${x}` });
      x += sw + 1.5;
    }
    y += rowH;
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={style} preserveAspectRatio="none">
      {stones.map(s => {
        const fill = `oklch(${s.tone} 0.018 85)`;
        const shadow = `oklch(${s.tone - 0.18} 0.018 80)`;
        return (
          <g key={s.key}>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={1.5} ry={1.5}
                  fill={fill} stroke={shadow} strokeWidth="0.6" strokeOpacity={0.35 * intensity}/>
            {/* highlight */}
            <rect x={s.x + 1} y={s.y + 0.8} width={s.w - 2} height={1} fill="#fff" opacity={0.25 * intensity}/>
          </g>
        );
      })}
    </svg>
  );
}

// Tiny leaf glyph for accents — a pointed ellipse + stem line.
function LeafGlyph({ size = 14, color = '#3f6b4a', tilt = -25, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${tilt}deg)`, ...style }}>
      <path d="M12 3 C 6 6, 4 14, 12 21 C 20 14, 18 6, 12 3 Z" fill={color}/>
      <path d="M12 5 L 12 19" stroke="#fff" strokeWidth="0.6" strokeOpacity="0.5" strokeLinecap="round"/>
    </svg>
  );
}

// Tendril/wisp — a thin curved stroke. Decorative.
function Tendril({ w = 80, h = 24, color = '#3f6b4a', style = {} }) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 24" style={style}>
      <path d="M2 12 Q 20 2, 40 12 T 78 12" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

// Plant badge — circle with monogram + soft watercolor halo.
function PlantBadge({ plant, size = 44, style = {} }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}>
      <Watercolor color={plant.color} opacity={0.55} seed={plant.id.length}
        style={{ position: 'absolute', inset: -size * 0.25, width: size * 1.5, height: size * 1.5 }}/>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'rgba(255,253,248,0.7)',
        border: `1px solid ${plant.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"DM Serif Display", "EB Garamond", Georgia, serif',
        fontSize: size * 0.42, color: '#2a3b2e', letterSpacing: '-0.01em',
      }}>{plant.initial}</div>
    </div>
  );
}

// Avatar dot — used for "fed by" indicators.
function UserDot({ user, size = 22, ring = false, style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: user.tone, color: 'rgba(255,253,248,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"DM Serif Display", Georgia, serif',
      fontSize: size * 0.5, letterSpacing: '-0.02em',
      boxShadow: ring ? `0 0 0 2px #fffdf8, 0 0 0 3px ${user.tone}55` : 'none',
      flexShrink: 0, ...style,
    }}>{user.initial}</div>
  );
}

Object.assign(window, { Watercolor, Drystone, LeafGlyph, Tendril, PlantBadge, UserDot });
