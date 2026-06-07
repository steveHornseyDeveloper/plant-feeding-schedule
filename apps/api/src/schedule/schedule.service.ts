import { Injectable } from '@nestjs/common';
import { computeSchedule, isoDate, type ScheduleEntry } from '@longstone/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async forWindow(from: string, to: string): Promise<ScheduleEntry[]> {
    const today = isoDate(new Date());
    const plants = await this.prisma.plant.findMany({
      include: {
        schedules: { orderBy: { id: 'asc' } },
        feedRecords: true,
        snoozes: true,
      },
      orderBy: { id: 'asc' },
    });

    const entries: ScheduleEntry[] = [];
    for (const plant of plants) {
      const plantEntries = computeSchedule({
        plant: { id: plant.id, startedAt: plant.startedAt.toISOString() },
        schedules: plant.schedules.map((s) => ({
          id: s.id,
          plantId: s.plantId,
          feed: s.feed,
          everyDays: s.everyDays,
          activeMonths: s.activeMonths,
        })),
        feedRecords: plant.feedRecords.map((r) => ({
          id: r.id,
          plantId: r.plantId,
          byUserId: r.byUserId,
          feed: r.feed,
          fedAt: r.fedAt.toISOString(),
          dueDate: r.dueDate.toISOString(),
        })),
        snoozes: plant.snoozes.map((s) => ({
          id: s.id,
          plantId: s.plantId,
          feed: s.feed,
          dueDate: s.dueDate.toISOString(),
          deferToDate: s.deferToDate.toISOString(),
        })),
        from,
        to,
        today,
      });
      entries.push(...plantEntries);
    }

    entries.sort((a, b) =>
      a.date === b.date ? a.plantId - b.plantId : a.date.localeCompare(b.date),
    );
    return entries;
  }
}
