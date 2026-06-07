import {
  addDays,
  firstDayOfNextActiveMonth,
  isoDate,
  monthOf,
  parseIso,
  sameDay,
} from './dateUtil.js';
import type {
  FeedRecord,
  FeedingSchedule,
  Plant,
  ScheduleEntry,
  ScheduleStatus,
  Snooze,
} from './types.js';

export function nextDueAfter(date: Date, schedule: FeedingSchedule): Date {
  let candidate = addDays(date, schedule.everyDays);
  while (!schedule.activeMonths.includes(monthOf(candidate))) {
    candidate = firstDayOfNextActiveMonth(candidate, schedule.activeMonths);
  }
  return candidate;
}

function statusFor(entryDate: Date, today: Date): ScheduleStatus {
  if (entryDate.getTime() < today.getTime() && !sameDay(entryDate, today)) return 'overdue';
  if (sameDay(entryDate, today)) return 'today';
  return 'upcoming';
}

type ComputeArgs = {
  plant: Pick<Plant, 'id' | 'startedAt'>;
  schedules: FeedingSchedule[];
  feedRecords: FeedRecord[];
  snoozes: Snooze[];
  from: string;
  to: string;
  today: string;
};

export function computeSchedule({
  plant,
  schedules,
  feedRecords,
  snoozes,
  from,
  to,
  today,
}: ComputeArgs): ScheduleEntry[] {
  const fromDate = parseIso(from);
  const toDate = parseIso(to);
  const todayDate = parseIso(today);
  const out: ScheduleEntry[] = [];

  for (const schedule of schedules) {
    const matching = feedRecords.filter((r) => r.feed === schedule.feed);
    const anchorIso = matching.length
      ? matching.reduce((m, r) => (r.fedAt > m ? r.fedAt : m), matching[0]!.fedAt)
      : plant.startedAt;
    const anchor = parseIso(anchorIso.slice(0, 10));

    let cursor = nextDueAfter(anchor, schedule);
    let safety = 0;
    while (cursor.getTime() <= toDate.getTime() && safety++ < 200) {
      if (cursor.getTime() >= fromDate.getTime()) {
        const snoozed = snoozes.find(
          (s) =>
            s.plantId === plant.id &&
            s.feed === schedule.feed &&
            sameDay(parseIso(s.dueDate.slice(0, 10)), cursor),
        );
        const entryDate = snoozed ? parseIso(snoozed.deferToDate.slice(0, 10)) : cursor;
        const fed = feedRecords.find(
          (r) =>
            r.plantId === plant.id &&
            r.feed === schedule.feed &&
            sameDay(parseIso(r.dueDate.slice(0, 10)), cursor),
        );
        out.push({
          plantId: plant.id,
          date: isoDate(entryDate),
          feed: schedule.feed,
          status: statusFor(entryDate, todayDate),
          snoozedFrom: snoozed ? isoDate(cursor) : undefined,
          fed: fed
            ? { byUserId: fed.byUserId, fedAt: fed.fedAt }
            : undefined,
        });
      }
      cursor = nextDueAfter(cursor, schedule);
    }
  }

  out.sort((a, b) => (a.date === b.date ? a.feed.localeCompare(b.feed) : a.date.localeCompare(b.date)));
  return out;
}
