import { Watercolor } from '../components/botanical/Watercolor';
import { VERDURE } from '../theme/tokens';

type Props = {
  title: string;
  subtitle: string;
  accent?: string;
};

export function HeroHeader({ title, subtitle, accent = VERDURE.leaf }: Props) {
  return (
    <div style={{ position: 'relative', padding: '22px 22px 10px' }}>
      <Watercolor
        color={accent}
        opacity={0.28}
        seed={3}
        style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220 }}
      />
      <Watercolor
        color={VERDURE.bloom}
        opacity={0.18}
        seed={5}
        style={{ position: 'absolute', top: 30, left: -50, width: 170, height: 170 }}
      />
      <div style={{ position: 'relative' }}>
        <div
          style={{
            fontFamily: 'Sora, system-ui',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: VERDURE.moss,
            opacity: 0.7,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 38,
            lineHeight: 1.05,
            color: VERDURE.ink,
            letterSpacing: '-0.02em',
            marginTop: 2,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
