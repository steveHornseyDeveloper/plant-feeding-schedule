import type { CSSProperties } from 'react';

type Props = {
  size?: number;
  color?: string;
  tilt?: number;
  style?: CSSProperties;
};

export function LeafGlyph({ size = 14, color = '#3f6b4a', tilt = -25, style }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${tilt}deg)`, ...style }}
    >
      <path d="M12 3 C 6 6, 4 14, 12 21 C 20 14, 18 6, 12 3 Z" fill={color} />
      <path
        d="M12 5 L 12 19"
        stroke="#fff"
        strokeWidth="0.6"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
