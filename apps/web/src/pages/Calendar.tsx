import { useMemo, useState } from 'react';
import {
  endOfMonth,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  isSameDay,
  parseISO,
  startOfMonth,
} from 'date-fns';
import type { ScheduleEntry } from '@longstone/shared';
import { BrandRow } from '../layout/BrandRow';
import { HeroHeader } from '../layout/HeroHeader';
import { DrystoneDivider } from '../layout/DrystoneDivider';
import { TaskRow } from '../components/TaskRow';
import { usePlants } from '../hooks/usePlants';
import { useSchedule } from '../hooks/useSchedule';
import { fmtDay, todayIso } from '../lib/dates';
import { VERDURE } from '../theme/tokens';

export function Calendar() {
  const today = useMemo(() => todayIso(), []);
  const todayDate = useMemo(() => parseISO(today), [today]);
  const [cursorMonth, setCursorMonth] = useState<Date>(todayDate);
  const [selected, setSelected] = useState<string>(today);

  const monthStart = startOfMonth(cursorMonth);
  const monthEnd = endOfMonth(cursorMonth);
  const fromIso = format(monthStart, 'yyyy-MM-dd');
  const toIso = format(monthEnd, 'yyyy-MM-dd');

  const plants = usePlants();
  const schedule = useSchedule(fromIso, toIso);

  if (plants.isLoading || schedule.isLoading) return <Pad>Loading…</Pad>;
  if (!plants.data || !schedule.data) return null;

  const plantById = new Map(plants.data.map((p) => [p.id, p]));
  const byDay = new Map<number, ScheduleEntry[]>();
  for (const e of schedule.data) {
    const d = parseISO(e.date);
    if (
      d.getFullYear() === monthStart.getFullYear() &&
      d.getMonth() === monthStart.getMonth()
    ) {
      const k = d.getDate();
      const list = byDay.get(k) ?? [];
      list.push(e);
      byDay.set(k, list);
    }
  }

  const monthDays = getDaysInMonth(monthStart);
  const startDow = getDay(monthStart);
  const cells: Array<number | null> = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= monthDays; d++) cells.push(d);

  const selectedEntries = schedule.data.filter((e) => e.date === selected);

  return (
    <>
      <BrandRow />
      <HeroHeader title={format(monthStart, 'MMMM yyyy')} subtitle="The feeding month" />
      <DrystoneDivider intensity={1} w={350} />

      <div
        style={{
          padding: '6px 16px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
        }}
      >
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontFamily: 'Sora, system-ui',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: VERDURE.inkSoft,
              opacity: 0.6,
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          padding: '4px 14px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
        }}
      >
        {cells.map((d, i) => {
          if (!d) return <div key={i} style={{ aspectRatio: '1' }} />;
          const dayDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), d);
          const tasks = byDay.get(d) ?? [];
          const isToday = isSameDay(dayDate, todayDate);
          const dayIso = format(dayDate, 'yyyy-MM-dd');
          const isSelected = dayIso === selected;
          const hasOverdue = tasks.some((t) => t.status === 'overdue');
          return (
            <button
              key={i}
              onClick={() => setSelected(dayIso)}
              style={{
                aspectRatio: '1',
                position: 'relative',
                borderRadius: 9,
                padding: 4,
                background: isToday
                  ? VERDURE.moss
                  : tasks.length
                    ? VERDURE.card
                    : 'transparent',
                border:
                  tasks.length && !isToday
                    ? `1px solid ${isSelected ? VERDURE.moss : VERDURE.cardEdge}`
                    : isSelected
                      ? `1px solid ${VERDURE.moss}`
                      : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <div
                style={{
                  fontFamily: '"DM Serif Display", Georgia, serif',
                  fontSize: 13,
                  fontWeight: 400,
                  color: isToday
                    ? '#fffdf8'
                    : hasOverdue
                      ? VERDURE.rust
                      : VERDURE.ink,
                }}
              >
                {d}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, marginTop: 2 }}>
                {tasks.slice(0, 3).map((t, j) => {
                  const plant = plantById.get(t.plantId);
                  return (
                    <span
                      key={j}
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: isToday ? '#fffdf8' : (plant?.color ?? VERDURE.leaf),
                      }}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: '12px 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'Sora, system-ui',
          fontSize: 12,
          color: VERDURE.inkSoft,
        }}
      >
        <button
          onClick={() => {
            const next = new Date(cursorMonth);
            next.setMonth(next.getMonth() - 1);
            setCursorMonth(next);
          }}
          style={navBtn()}
        >
          ‹ {format(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() - 1, 1), 'MMM')}
        </button>
        <button
          onClick={() => setCursorMonth(todayDate)}
          style={navBtn(true)}
        >
          Today
        </button>
        <button
          onClick={() => {
            const next = new Date(cursorMonth);
            next.setMonth(next.getMonth() + 1);
            setCursorMonth(next);
          }}
          style={navBtn()}
        >
          {format(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1, 1), 'MMM')} ›
        </button>
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
          {fmtDay(selected)}
          {selected === today ? ' · today' : ''}
        </div>
        <div
          style={{
            background: VERDURE.card,
            borderRadius: 14,
            padding: '2px 12px',
            border: `1px solid ${VERDURE.cardEdge}`,
          }}
        >
          {selectedEntries.length === 0 && (
            <div
              style={{
                padding: '14px 6px',
                fontFamily: 'Sora, system-ui',
                fontSize: 12,
                color: VERDURE.inkSoft,
                opacity: 0.7,
              }}
            >
              No feeds scheduled.
            </div>
          )}
          {selectedEntries.map((e) => {
            const plant = plantById.get(e.plantId);
            if (!plant) return null;
            return (
              <TaskRow
                key={`${e.plantId}-${e.feed}-${e.date}`}
                entry={e}
                plant={plant}
                dim={getDate(parseISO(e.date)) < getDate(todayDate) && e.status === 'upcoming'}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function navBtn(active = false): React.CSSProperties {
  return {
    padding: '6px 12px',
    border: `1px solid ${VERDURE.cardEdge}`,
    background: active ? VERDURE.moss : 'transparent',
    color: active ? '#fffdf8' : VERDURE.inkSoft,
    fontFamily: 'Sora, system-ui',
    fontSize: 12,
    borderRadius: 999,
    cursor: 'pointer',
  };
}

function Pad({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '40px 22px', fontFamily: 'Sora, system-ui', color: VERDURE.inkSoft }}>
      {children}
    </div>
  );
}
