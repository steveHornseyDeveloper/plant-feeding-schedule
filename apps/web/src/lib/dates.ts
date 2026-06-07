import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { isoDate } from '@longstone/shared';

export function todayIso(): string {
  return isoDate(new Date());
}

export function parse(d: string): Date {
  return parseISO(d.length > 10 ? d.slice(0, 10) : d);
}

export function fmtDay(d: string): string {
  return format(parse(d), 'EEE d MMM');
}

export function fmtFull(d: string): string {
  return format(parse(d), 'EEEE d MMMM yyyy');
}

export function relWhen(d: string, today: string = todayIso()): string {
  const diff = differenceInCalendarDays(parse(d), parse(today));
  if (diff < -1) return `${-diff} days overdue`;
  if (diff === -1) return 'Yesterday';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7) return `In ${diff} days`;
  return fmtDay(d);
}
