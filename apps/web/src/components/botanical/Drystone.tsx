import type { CSSProperties } from 'react';

type Props = {
  rows?: number;
  w?: number;
  h?: number;
  intensity?: number;
  style?: CSSProperties;
};

type Stone = { x: number; y: number; w: number; h: number; tone: number; key: string };

export function Drystone({ rows = 3, w = 320, h = 36, intensity = 1, style }: Props) {
  const stones: Stone[] = [];
  let y = 0;
  for (let r = 0; r < rows; r++) {
    const rowH = h / rows;
    let x = -10 + (r % 2) * (rowH * 0.6);
    while (x < w + 10) {
      const sw = 18 + (Math.sin(r * 7.13 + x * 0.071) + 1) * 22;
      const sh = rowH - 1.5;
      const tone = 0.78 + Math.sin(r * 3.7 + x * 0.09) * 0.07;
      const tilt = Math.sin(r * 5 + x * 0.13) * 1.5 * intensity;
      stones.push({ x, y: y + tilt, w: sw, h: sh, tone, key: `${r}-${x}` });
      x += sw + 1.5;
    }
    y += rowH;
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={style} preserveAspectRatio="none">
      {stones.map((s) => {
        const fill = `oklch(${s.tone} 0.018 85)`;
        const shadow = `oklch(${s.tone - 0.18} 0.018 80)`;
        return (
          <g key={s.key}>
            <rect
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx={1.5}
              ry={1.5}
              fill={fill}
              stroke={shadow}
              strokeWidth="0.6"
              strokeOpacity={0.35 * intensity}
            />
            <rect
              x={s.x + 1}
              y={s.y + 0.8}
              width={s.w - 2}
              height={1}
              fill="#fff"
              opacity={0.25 * intensity}
            />
          </g>
        );
      })}
    </svg>
  );
}
