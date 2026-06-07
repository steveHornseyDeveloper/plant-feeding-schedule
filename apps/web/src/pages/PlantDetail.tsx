import { Link, useParams } from 'react-router-dom';
import { BrandRow } from '../layout/BrandRow';
import { DrystoneDivider } from '../layout/DrystoneDivider';
import { PlantBadge } from '../components/botanical/PlantBadge';
import { Watercolor } from '../components/botanical/Watercolor';
import { UserDot } from '../components/botanical/UserDot';
import { usePlant } from '../hooks/usePlants';
import { useUsers } from '../hooks/useUsers';
import { fmtDay, fmtFull } from '../lib/dates';
import { VERDURE } from '../theme/tokens';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;
  const { data: plant, isLoading } = usePlant(numericId);
  const { data: users } = useUsers();

  if (isLoading || !plant) {
    return <div style={{ padding: '40px 22px', color: VERDURE.inkSoft }}>Loading…</div>;
  }

  return (
    <>
      <BrandRow />
      <div style={{ padding: '12px 22px 0' }}>
        <Link
          to="/plants"
          style={{
            fontFamily: 'Sora, system-ui',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: VERDURE.moss,
            opacity: 0.85,
          }}
        >
          ‹ The garden
        </Link>
      </div>

      <div style={{ position: 'relative', padding: '12px 22px 8px' }}>
        <Watercolor
          color={plant.color}
          opacity={0.32}
          seed={plant.id * 7 + plant.initial.length || 1}
          style={{ position: 'absolute', top: -30, right: -50, width: 220, height: 220 }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-end',
          }}
        >
          <PlantBadge plant={plant} size={64} />
          <div style={{ flex: 1, minWidth: 0 }}>
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
              {plant.nick}
            </div>
            <div
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 32,
                lineHeight: 1.05,
                color: VERDURE.ink,
                letterSpacing: '-0.02em',
                marginTop: 2,
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
              }}
            >
              {plant.name}
              {plant.favourite && (
                <span style={{ color: VERDURE.wisteria, fontSize: 16 }}>✦</span>
              )}
            </div>
            <div
              style={{
                fontFamily: 'Sora, system-ui',
                fontSize: 13,
                color: VERDURE.inkSoft,
                opacity: 0.7,
                marginTop: 2,
              }}
            >
              {plant.location}
            </div>
          </div>
        </div>
      </div>
      <DrystoneDivider intensity={1} w={350} />

      <div style={{ padding: '0 22px' }}>
        <div
          style={{
            background: VERDURE.card,
            border: `1px solid ${VERDURE.cardEdge}`,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <div
            style={{
              fontFamily: 'Sora, system-ui',
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: VERDURE.moss,
              opacity: 0.85,
              marginBottom: 6,
            }}
          >
            Feeding plan
          </div>
          <div
            style={{
              fontFamily: 'Sora, system-ui',
              fontSize: 13,
              color: VERDURE.inkSoft,
              opacity: 0.85,
              marginBottom: 10,
            }}
          >
            {plant.feedNote}
          </div>
          {plant.schedules.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 0',
                borderTop: `1px solid ${VERDURE.cardEdge}`,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: plant.color,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: '"DM Serif Display", Georgia, serif',
                    fontSize: 17,
                    color: VERDURE.ink,
                  }}
                >
                  {s.feed}
                </div>
                <div
                  style={{
                    fontFamily: 'Sora, system-ui',
                    fontSize: 11,
                    color: VERDURE.inkSoft,
                    opacity: 0.7,
                  }}
                >
                  Every {s.everyDays} days · {s.activeMonths.map((m) => MONTH_LABELS[m - 1]).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 22px 0' }}>
        <div
          style={{
            fontFamily: 'Sora, system-ui',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: VERDURE.moss,
            opacity: 0.85,
            marginBottom: 8,
          }}
        >
          Recent feedings
        </div>
        <div
          style={{
            background: VERDURE.card,
            border: `1px solid ${VERDURE.cardEdge}`,
            borderRadius: 14,
            padding: '4px 14px',
          }}
        >
          {plant.history.length === 0 && (
            <div
              style={{
                padding: '14px 0',
                fontFamily: 'Sora, system-ui',
                fontSize: 12,
                color: VERDURE.inkSoft,
                opacity: 0.7,
              }}
            >
              No feedings recorded yet.
            </div>
          )}
          {plant.history.map((h) => {
            const u = users?.find((x) => x.id === h.by.id);
            return (
              <div
                key={h.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: `1px solid ${VERDURE.cardEdge}`,
                }}
              >
                {u && <UserDot user={u} size={22} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'Sora, system-ui',
                      fontSize: 13,
                      color: VERDURE.ink,
                      fontWeight: 500,
                    }}
                  >
                    {h.by.name} · {h.feed}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Sora, system-ui',
                      fontSize: 11,
                      color: VERDURE.inkSoft,
                      opacity: 0.7,
                    }}
                  >
                    {fmtFull(h.fedAt)}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'Sora, system-ui',
                    fontSize: 11,
                    color: VERDURE.inkSoft,
                    opacity: 0.5,
                  }}
                >
                  {fmtDay(h.dueDate)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
