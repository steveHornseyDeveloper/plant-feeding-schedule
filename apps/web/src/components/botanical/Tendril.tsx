import type { CSSProperties } from 'react';

type Props = {
  w?: number;
  h?: number;
  color?: string;
  style?: CSSProperties;
};

export function Tendril({ w = 80, h = 24, color = '#3f6b4a', style }: Props) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 24" style={style}>
      <path
        d="M2 12 Q 20 2, 40 12 T 78 12"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
