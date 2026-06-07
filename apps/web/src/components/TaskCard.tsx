import type { PlantWithSchedules, ScheduleEntry, User } from '@longstone/shared';
import { LeafGlyph } from './botanical/LeafGlyph';
import { PlantBadge } from './botanical/PlantBadge';
import { UserDot } from './botanical/UserDot';
import { Watercolor } from './botanical/Watercolor';
import { VERDURE } from '../theme/tokens';
import { differenceInCalendarDays } from 'date-fns';
import { parse, todayIso } from '../lib/dates';

type Props = {
  entry: ScheduleEntry;
  plant: PlantWithSchedules;
  fedBy?: User;
  onMarkFed: () => void;
  onSnooze: () => void;
  busy?: boolean;
};

export function TaskCard({ entry, plant, fedBy, onMarkFed, onSnooze, busy }: Props) {
  const overdue = entry.status === 'overdue';
  const today = todayIso();
  const overdueDays =
    overdue ? Math.abs(differenceInCalendarDays(parse(entry.date), parse(today))) : 0;

  return (
    <div
      style={{
        position: 'relative',
        background: VERDURE.card,
        border: `1px solid ${overdue ? '#c47a4a55' : VERDURE.cardEdge}`,
        borderRadius: 18,
        padding: '14px 14px 12px',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 18px rgba(63,107,74,0.06)',
        overflow: 'hidden',
      }}
    >
      <Watercolor
        color={plant.color}
        opacity={0.22}
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
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
        <PlantBadge plant={plant} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 22,
                color: VERDURE.ink,
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {plant.name}
            </div>
            {plant.favourite && (
              <span style={{ color: VERDURE.wisteria, fontSize: 13 }}>✦</span>
            )}
          </div>
          <div
            style={{
              fontFamily: 'Sora, system-ui',
              fontSize: 12,
              color: VERDURE.inkSoft,
              opacity: 0.7,
              marginTop: 1,
            }}
          >
            {plant.location}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: overdue ? VERDURE.rustDot : VERDURE.leaf,
              }}
            />
            <span
              style={{
                fontFamily: 'Sora, system-ui',
                fontSize: 13,
                color: VERDURE.ink,
                fontWeight: 500,
              }}
            >
              {entry.feed}
            </span>
            <span style={{ color: VERDURE.inkSoft, opacity: 0.4, fontSize: 12 }}>·</span>
            <span
              style={{
                fontFamily: 'Sora, system-ui',
                fontSize: 12,
                color: overdue ? VERDURE.rust : VERDURE.inkSoft,
                fontStyle: overdue ? 'italic' : 'normal',
              }}
            >
              {overdue ? `${overdueDays} day${overdueDays === 1 ? '' : 's'} overdue` : 'Due today'}
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {entry.fed && fedBy ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              borderRadius: 12,
              background: `${VERDURE.leaf}15`,
              border: `1px solid ${VERDURE.leaf}30`,
            }}
          >
            <UserDot user={fedBy} size={20} />
            <span
              style={{
                fontFamily: 'Sora, system-ui',
                fontSize: 13,
                color: VERDURE.moss,
                fontWeight: 500,
              }}
            >
              {fedBy.name} fed · just now
            </span>
            <LeafGlyph size={14} color={VERDURE.leaf} style={{ marginLeft: 'auto' }} />
          </div>
        ) : (
          <>
            <button
              onClick={onMarkFed}
              disabled={busy}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: 'none',
                borderRadius: 12,
                background: VERDURE.moss,
                color: '#fffdf8',
                fontFamily: 'Sora, system-ui',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: busy ? 'wait' : 'pointer',
                opacity: busy ? 0.6 : 1,
              }}
            >
              <LeafGlyph size={12} color="#fffdf8" tilt={-25} />
              Mark fed
            </button>
            <button
              onClick={onSnooze}
              disabled={busy}
              style={{
                padding: '10px 12px',
                border: `1px solid ${VERDURE.cardEdge}`,
                borderRadius: 12,
                background: 'transparent',
                color: VERDURE.inkSoft,
                fontFamily: 'Sora, system-ui',
                fontSize: 13,
                cursor: busy ? 'wait' : 'pointer',
              }}
            >
              Snooze
            </button>
          </>
        )}
      </div>
    </div>
  );
}
