import { Link } from 'react-router-dom';
import { BrandRow } from '../layout/BrandRow';
import { HeroHeader } from '../layout/HeroHeader';
import { DrystoneDivider } from '../layout/DrystoneDivider';
import { PlantBadge } from '../components/botanical/PlantBadge';
import { Watercolor } from '../components/botanical/Watercolor';
import { usePlants } from '../hooks/usePlants';
import { fmtDay } from '../lib/dates';
import { VERDURE } from '../theme/tokens';

export function PlantsList() {
  const { data: plants, isLoading } = usePlants();
  if (isLoading || !plants) {
    return <div style={{ padding: '40px 22px', color: VERDURE.inkSoft }}>Loading…</div>;
  }
  return (
    <>
      <BrandRow />
      <HeroHeader title="The garden" subtitle={`${plants.length} plants · Longstone`} />
      <DrystoneDivider intensity={1} w={350} />
      <div
        style={{
          padding: '4px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {plants.map((plant) => (
          <Link
            key={plant.id}
            to={`/plants/${plant.id}`}
            style={{
              display: 'block',
              position: 'relative',
              background: VERDURE.card,
              border: `1px solid ${VERDURE.cardEdge}`,
              borderRadius: 18,
              padding: '14px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 18px rgba(63,107,74,0.06)',
              overflow: 'hidden',
            }}
          >
            <Watercolor
              color={plant.color}
              opacity={0.18}
              seed={plant.id * 7 + plant.initial.length || 1}
              style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 130,
                height: 130,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <PlantBadge plant={plant} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"DM Serif Display", Georgia, serif',
                      fontSize: 20,
                      color: VERDURE.ink,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {plant.name}
                  </div>
                  {plant.favourite && (
                    <span style={{ color: VERDURE.wisteria, fontSize: 12 }}>✦</span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: 'Sora, system-ui',
                    fontSize: 12,
                    color: VERDURE.inkSoft,
                    opacity: 0.7,
                  }}
                >
                  {plant.location}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: 'Sora, system-ui',
                    fontSize: 11.5,
                    color: VERDURE.moss,
                  }}
                >
                  {plant.schedules.map((s) => s.feed).join(' · ')}
                </div>
                {plant.lastFedAt && (
                  <div
                    style={{
                      marginTop: 2,
                      fontFamily: 'Sora, system-ui',
                      fontSize: 11,
                      color: VERDURE.inkSoft,
                      opacity: 0.6,
                    }}
                  >
                    Last fed {fmtDay(plant.lastFedAt)}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
