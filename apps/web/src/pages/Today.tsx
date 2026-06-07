import { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import type { ScheduleEntry } from '@longstone/shared';
import { BrandRow } from '../layout/BrandRow';
import { HeroHeader } from '../layout/HeroHeader';
import { DrystoneDivider } from '../layout/DrystoneDivider';
import { TaskCard } from '../components/TaskCard';
import { TaskRow } from '../components/TaskRow';
import { SnoozeSheet } from '../components/SnoozeSheet';
import { Tendril } from '../components/botanical/Tendril';
import { usePlants } from '../hooks/usePlants';
import { useSchedule } from '../hooks/useSchedule';
import { useUsers } from '../hooks/useUsers';
import { useIdentity } from '../hooks/useIdentity';
import { useMarkFed, useSnooze } from '../hooks/useMutations';
import { fmtDay, todayIso } from '../lib/dates';
import { VERDURE } from '../theme/tokens';

export function Today() {
  const me = useIdentity();
  const today = todayIso();
  const from = useMemo(() => format(addDays(new Date(today), -7), 'yyyy-MM-dd'), [today]);
  const to = useMemo(() => format(addDays(new Date(today), 14), 'yyyy-MM-dd'), [today]);

  const plants = usePlants();
  const schedule = useSchedule(from, to);
  const users = useUsers();
  const markFed = useMarkFed(me);
  const snooze = useSnooze(me);

  const [snoozeTarget, setSnoozeTarget] = useState<{
    plantId: number;
    feed: string;
    dueDate: string;
  } | null>(null);

  if (plants.isLoading || schedule.isLoading || users.isLoading) {
    return <Loading />;
  }
  if (plants.error || schedule.error || users.error) {
    return <ErrorBlock message={(plants.error ?? schedule.error ?? users.error)!.message} />;
  }
  if (!plants.data || !schedule.data || !users.data) return <Loading />;

  const plantById = new Map(plants.data.map((p) => [p.id, p]));
  const userById = new Map(users.data.map((u) => [u.id, u]));

  const todays: ScheduleEntry[] = schedule.data.filter(
    (e) => e.status === 'overdue' || e.status === 'today',
  );
  const upcoming = schedule.data.filter((e) => e.status === 'upcoming').slice(0, 4);

  return (
    <>
      <BrandRow />
      <HeroHeader title="Today's feed" subtitle={`${fmtDay(today)} · ${plants.data.length} plants`} />
      <DrystoneDivider intensity={1} w={350} />

      <div
        style={{
          padding: '4px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {todays.length === 0 && (
          <div
            style={{
              padding: '20px 14px',
              background: VERDURE.card,
              border: `1px solid ${VERDURE.cardEdge}`,
              borderRadius: 18,
              fontFamily: 'Sora, system-ui',
              fontSize: 13,
              color: VERDURE.inkSoft,
              textAlign: 'center',
            }}
          >
            Nothing due today. Take a walk in the garden.
          </div>
        )}
        {todays.map((entry) => {
          const plant = plantById.get(entry.plantId);
          if (!plant) return null;
          const fedBy = entry.fed ? userById.get(entry.fed.byUserId) : undefined;
          return (
            <TaskCard
              key={`${entry.plantId}-${entry.feed}-${entry.date}`}
              entry={entry}
              plant={plant}
              fedBy={fedBy}
              busy={markFed.isPending || snooze.isPending}
              onMarkFed={() =>
                markFed.mutate({
                  plantId: entry.plantId,
                  feed: entry.feed,
                  dueDate: entry.snoozedFrom ?? entry.date,
                })
              }
              onSnooze={() =>
                setSnoozeTarget({
                  plantId: entry.plantId,
                  feed: entry.feed,
                  dueDate: entry.snoozedFrom ?? entry.date,
                })
              }
            />
          );
        })}
      </div>

      <div style={{ padding: '24px 22px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
          }}
        >
          <Tendril w={28} h={12} color={VERDURE.moss} />
          <div
            style={{
              fontFamily: 'Sora, system-ui',
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: VERDURE.moss,
              opacity: 0.85,
            }}
          >
            Coming up
          </div>
        </div>
        <div
          style={{
            background: VERDURE.card,
            borderRadius: 14,
            padding: '4px 12px',
            border: `1px solid ${VERDURE.cardEdge}`,
          }}
        >
          {upcoming.length === 0 && (
            <div
              style={{
                padding: '14px 6px',
                fontFamily: 'Sora, system-ui',
                fontSize: 12,
                color: VERDURE.inkSoft,
                opacity: 0.7,
              }}
            >
              No upcoming feeds in the next 14 days.
            </div>
          )}
          {upcoming.map((entry) => {
            const plant = plantById.get(entry.plantId);
            if (!plant) return null;
            return (
              <TaskRow
                key={`${entry.plantId}-${entry.feed}-${entry.date}`}
                entry={entry}
                plant={plant}
              />
            );
          })}
        </div>
      </div>

      <SnoozeSheet
        open={snoozeTarget !== null}
        onClose={() => setSnoozeTarget(null)}
        onSnooze={(days) => {
          if (!snoozeTarget) return;
          snooze.mutate({ ...snoozeTarget, days }, { onSettled: () => setSnoozeTarget(null) });
        }}
      />
    </>
  );
}

function Loading() {
  return (
    <div
      style={{
        padding: '40px 22px',
        fontFamily: 'Sora, system-ui',
        color: VERDURE.inkSoft,
      }}
    >
      Loading…
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '40px 22px',
        fontFamily: 'Sora, system-ui',
        color: VERDURE.rust,
      }}
    >
      Couldn't load: {message}
    </div>
  );
}
