import type { CSSProperties } from 'react';

type Props = {
  color?: string;
  opacity?: number;
  seed?: number;
  style?: CSSProperties;
};

export function Watercolor({
  color = '#7aa67a',
  opacity = 0.35,
  seed = 1,
  style,
}: Props) {
  const r = (a: number, b: number) =>
    a + (((seed * 9301 + 49297) % 233280) / 233280) * (b - a);
  const id = `wc${seed}-${color.replace('#', '')}`;
  return (
    <svg viewBox="0 0 200 200" style={style} preserveAspectRatio="none">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <stop offset="60%" stopColor={color} stopOpacity={opacity * 0.5} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx={100 + r(-15, 15)}
        cy={100 + r(-15, 15)}
        rx={r(70, 95)}
        ry={r(70, 95)}
        fill={`url(#${id})`}
      />
      <ellipse
        cx={100 + r(-25, 25)}
        cy={100 + r(-25, 25)}
        rx={r(45, 65)}
        ry={r(45, 65)}
        fill={`url(#${id})`}
      />
      <ellipse
        cx={100 + r(-30, 30)}
        cy={100 + r(-30, 30)}
        rx={r(30, 50)}
        ry={r(30, 50)}
        fill={`url(#${id})`}
      />
    </svg>
  );
}
