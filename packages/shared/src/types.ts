export type UserSlug = 'alexa' | 'stevie';

export type User = {
  id: number;
  slug: UserSlug;
  name: string;
  initial: string;
  tone: string;
};

export type Plant = {
  id: number;
  name: string;
  nick: string;
  location: string;
  feedNote: string;
  color: string;
  initial: string;
  favourite: boolean;
  startedAt: string;
};

export type FeedingSchedule = {
  id: number;
  plantId: number;
  feed: string;
  everyDays: number;
  activeMonths: number[];
};

export type FeedRecord = {
  id: number;
  plantId: number;
  byUserId: number;
  feed: string;
  fedAt: string;
  dueDate: string;
};

export type Snooze = {
  id: number;
  plantId: number;
  feed: string;
  dueDate: string;
  deferToDate: string;
};

export type ScheduleStatus = 'overdue' | 'today' | 'upcoming';

export type ScheduleEntry = {
  plantId: number;
  date: string;
  feed: string;
  status: ScheduleStatus;
  snoozedFrom?: string;
  fed?: { byUserId: number; fedAt: string };
};

export type PlantWithSchedules = Plant & {
  schedules: FeedingSchedule[];
  lastFedAt?: string;
  nextDueDate?: string;
};
