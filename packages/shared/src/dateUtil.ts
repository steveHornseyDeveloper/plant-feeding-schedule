// All date math is calendar-day based (Europe/London semantics).
// Inputs are ISO YYYY-MM-DD strings; internal handling uses UTC noon to
// avoid DST edge effects when adding days.

export function isoDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseIso(s: string): Date {
  // Anchor at noon UTC to keep "the same calendar day everywhere on Earth".
  return new Date(`${s}T12:00:00.000Z`);
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function monthOf(d: Date): number {
  return d.getUTCMonth() + 1; // 1..12
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export function firstDayOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
}

export function firstDayOfNextActiveMonth(d: Date, activeMonths: number[]): Date {
  if (activeMonths.length === 0) {
    throw new Error('activeMonths cannot be empty');
  }
  let year = d.getUTCFullYear();
  let month = monthOf(d);
  for (let i = 0; i < 24; i++) {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    if (activeMonths.includes(month)) return firstDayOfMonth(year, month);
  }
  throw new Error('Could not find next active month within 24 iterations');
}
