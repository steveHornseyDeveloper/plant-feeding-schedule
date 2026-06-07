import type { CSSProperties } from 'react';
import { Watercolor } from './Watercolor';

type PlantLike = {
  id: number;
  initial: string;
  color: string;
};

type Props = {
  plant: PlantLike;
  size?: number;
  style?: CSSProperties;
};

export function PlantBadge({ plant, size = 44, style }: Props) {
  // Original prototype keyed seed off plant.id.length when ids were strings.
  // With int ids, derive a stable seed from the id itself + initial length so
  // each plant still gets a consistent watercolor.
  const seed = (plant.id * 7 + plant.initial.length) || 1;
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      <Watercolor
        color={plant.color}
        opacity={0.55}
        seed={seed}
        style={{
          position: 'absolute',
          inset: -size * 0.25,
          width: size * 1.5,
          height: size * 1.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(255,253,248,0.7)',
          border: `1px solid ${plant.color}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"DM Serif Display", "EB Garamond", Georgia, serif',
          fontSize: size * 0.42,
          color: '#2a3b2e',
          letterSpacing: '-0.01em',
        }}
      >
        {plant.initial}
      </div>
    </div>
  );
}
