import type { PlantWithSchedules, ScheduleEntry } from '@longstone/shared';
import { PlantBadge } from './botanical/PlantBadge';
import { VERDURE } from '../theme/tokens';
import { fmtDay, relWhen } from '../lib/dates';

type Props = {
  entry: ScheduleEntry;
  plant: PlantWithSchedules;
  dim?: boolean;
};

export function TaskRow({ entry, plant, dim = false }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 6px',
        borderBottom: `1px solid ${VERDURE.cardEdge}`,
        opacity: dim ? 0.55 : 1,
      }}
    >
      <PlantBadge plant={plant} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 16,
            color: VERDURE.ink,
            lineHeight: 1.1,
          }}
        >
          {plant.name}
        </div>
        <div
          style={{
            fontFamily: 'Sora, system-ui',
            fontSize: 11.5,
            color: VERDURE.inkSoft,
            opacity: 0.75,
            marginTop: 1,
          }}
        >
          {entry.feed}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            fontFamily: 'Sora, system-ui',
            fontSize: 12,
            color: VERDURE.moss,
            fontWeight: 500,
          }}
        >
          {relWhen(entry.date)}
        </div>
        <div
          style={{
            fontFamily: 'Sora, system-ui',
            fontSize: 10.5,
            color: VERDURE.inkSoft,
            opacity: 0.5,
          }}
        >
          {fmtDay(entry.date)}
        </div>
      </div>
    </div>
  );
}
