import type { CSSProperties } from 'react';

type UserLike = {
  initial: string;
  tone: string;
  name?: string;
};

type Props = {
  user: UserLike;
  size?: number;
  ring?: boolean;
  style?: CSSProperties;
};

export function UserDot({ user, size = 22, ring = false, style }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: user.tone,
        color: 'rgba(255,253,248,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"DM Serif Display", Georgia, serif',
        fontSize: size * 0.5,
        letterSpacing: '-0.02em',
        boxShadow: ring ? `0 0 0 2px #fffdf8, 0 0 0 3px ${user.tone}55` : 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      {user.initial}
    </div>
  );
}
