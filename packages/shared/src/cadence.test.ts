import { describe, expect, it } from 'vitest';
import { computeSchedule, nextDueAfter } from './cadence.js';
import { parseIso } from './dateUtil.js';
import type { FeedingSchedule } from './types.js';

const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const plant = { id: 1, startedAt: '2026-04-01' };

const everyTwoWeeks: FeedingSchedule = {
  id: 1,
  plantId: 1,
  feed: 'Tomato feed',
  everyDays: 14,
  activeMonths: allMonths,
};

describe('nextDueAfter', () => {
  it('adds everyDays when in active month', () => {
    const result = nextDueAfter(parseIso('2026-05-01'), everyTwoWeeks);
    expect(result.toISOString().slice(0, 10)).toBe('2026-05-15');
  });

  it('snaps to first day of next active month when result lands in inactive month', () => {
    const aprToSep: FeedingSchedule = {
      ...everyTwoWeeks,
      activeMonths: [4, 5, 6, 7, 8, 9],
    };
    // 2026-09-25 + 14 = 2026-10-09 (Oct inactive) → snap to 2027-04-01
    const result = nextDueAfter(parseIso('2026-09-25'), aprToSep);
    expect(result.toISOString().slice(0, 10)).toBe('2027-04-01');
  });

  it('walks across multiple inactive months', () => {
    const onlyMay: FeedingSchedule = {
      ...everyTwoWeeks,
      activeMonths: [5],
    };
    const result = nextDueAfter(parseIso('2026-05-25'), onlyMay);
    expect(result.toISOString().slice(0, 10)).toBe('2027-05-01');
  });
});

describe('computeSchedule', () => {
  it('produces entries from startedAt when there is no history', () => {
    const entries = computeSchedule({
      plant,
      schedules: [everyTwoWeeks],
      feedRecords: [],
      snoozes: [],
      from: '2026-04-01',
      to: '2026-05-31',
      today: '2026-05-10',
    });
    expect(entries.map((e) => e.date)).toEqual([
      '2026-04-15',
      '2026-04-29',
      '2026-05-13',
      '2026-05-27',
    ]);
  });

  it('marks past entries as overdue and entries on today as today', () => {
    const entries = computeSchedule({
      plant,
      schedules: [everyTwoWeeks],
      feedRecords: [],
      snoozes: [],
      from: '2026-04-01',
      to: '2026-05-31',
      today: '2026-04-29',
    });
    const overdue = entries.filter((e) => e.status === 'overdue');
    const today = entries.filter((e) => e.status === 'today');
    const upcoming = entries.filter((e) => e.status === 'upcoming');
    expect(overdue.map((e) => e.date)).toEqual(['2026-04-15']);
    expect(today.map((e) => e.date)).toEqual(['2026-04-29']);
    expect(upcoming.map((e) => e.date)).toEqual(['2026-05-13', '2026-05-27']);
  });

  it('shifts cadence forward when a feed is recorded', () => {
    const entries = computeSchedule({
      plant,
      schedules: [everyTwoWeeks],
      feedRecords: [
        { id: 1, plantId: 1, byUserId: 1, feed: 'Tomato feed', fedAt: '2026-05-10', dueDate: '2026-04-29' },
      ],
      snoozes: [],
      from: '2026-04-01',
      to: '2026-06-30',
      today: '2026-05-10',
    });
    // Anchor = 2026-05-10, next entries = 24/05, 07/06, 21/06.
    expect(entries.map((e) => e.date)).toEqual(['2026-05-24', '2026-06-07', '2026-06-21']);
  });

  it('applies a snooze to the matching entry without changing future cadence', () => {
    const entries = computeSchedule({
      plant,
      schedules: [everyTwoWeeks],
      feedRecords: [],
      snoozes: [
        { id: 1, plantId: 1, feed: 'Tomato feed', dueDate: '2026-04-29', deferToDate: '2026-05-02' },
      ],
      from: '2026-04-01',
      to: '2026-05-31',
      today: '2026-05-10',
    });
    expect(entries.map((e) => ({ date: e.date, snoozedFrom: e.snoozedFrom }))).toEqual([
      { date: '2026-04-15', snoozedFrom: undefined },
      { date: '2026-05-02', snoozedFrom: '2026-04-29' },
      { date: '2026-05-13', snoozedFrom: undefined },
      { date: '2026-05-27', snoozedFrom: undefined },
    ]);
  });

  it('handles a plant with multiple feeding schedules', () => {
    const ericaceous: FeedingSchedule = {
      id: 2, plantId: 1, feed: 'Ericaceous mulch', everyDays: 30, activeMonths: [3, 4, 5, 6],
    };
    const boneMeal: FeedingSchedule = {
      id: 3, plantId: 1, feed: 'Bone meal', everyDays: 30, activeMonths: [10],
    };
    const entries = computeSchedule({
      plant,
      schedules: [ericaceous, boneMeal],
      feedRecords: [],
      snoozes: [],
      from: '2026-04-01',
      to: '2026-12-31',
      today: '2026-05-10',
    });
    const feeds = new Set(entries.map((e) => e.feed));
    expect(feeds).toEqual(new Set(['Ericaceous mulch', 'Bone meal']));
    // Ericaceous: starts 2026-05-01 (startedAt 2026-04-01 + 30, May is active) — sequence 05-01, 05-31, 06-30 (but 06-30 + 30 = 07-30 → out of active; stop after 06-30).
    const erica = entries.filter((e) => e.feed === 'Ericaceous mulch').map((e) => e.date);
    expect(erica).toEqual(['2026-05-01', '2026-05-31', '2026-06-30']);
    // Bone meal: every 30 days, only Oct active. First = startedAt + 30 = 2026-05-01 → snap to 2026-10-01. Then +30 = 2026-10-31 (still Oct). Then +30 = 2026-11-30 → snap forward to 2027-10-01 (out of range).
    const bone = entries.filter((e) => e.feed === 'Bone meal').map((e) => e.date);
    expect(bone).toEqual(['2026-10-01', '2026-10-31']);
  });

  it('uses only the latest fedAt for the matching feed type', () => {
    const ericaceous: FeedingSchedule = {
      id: 2, plantId: 1, feed: 'Ericaceous mulch', everyDays: 30, activeMonths: allMonths,
    };
    const tomato: FeedingSchedule = {
      ...everyTwoWeeks,
    };
    const entries = computeSchedule({
      plant,
      schedules: [tomato, ericaceous],
      feedRecords: [
        { id: 1, plantId: 1, byUserId: 1, feed: 'Tomato feed', fedAt: '2026-05-08', dueDate: '2026-05-01' },
      ],
      snoozes: [],
      from: '2026-04-01',
      to: '2026-06-30',
      today: '2026-05-10',
    });
    // Tomato anchor = 2026-05-08 → 05-22, 06-05, 06-19
    const tomatoDates = entries.filter((e) => e.feed === 'Tomato feed').map((e) => e.date);
    expect(tomatoDates).toEqual(['2026-05-22', '2026-06-05', '2026-06-19']);
    // Ericaceous anchor = startedAt 2026-04-01 → 05-01, 05-31, 06-30
    const ericaDates = entries.filter((e) => e.feed === 'Ericaceous mulch').map((e) => e.date);
    expect(ericaDates).toEqual(['2026-05-01', '2026-05-31', '2026-06-30']);
  });
});
