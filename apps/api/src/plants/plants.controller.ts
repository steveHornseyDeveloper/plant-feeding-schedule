import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('plants')
export class PlantsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list() {
    const plants = await this.prisma.plant.findMany({
      orderBy: { id: 'asc' },
      include: {
        schedules: { orderBy: { id: 'asc' } },
        feedRecords: { orderBy: { fedAt: 'desc' }, take: 1 },
      },
    });
    return plants.map((p) => ({
      id: p.id,
      name: p.name,
      nick: p.nick,
      location: p.location,
      feedNote: p.feedNote,
      color: p.color,
      initial: p.initial,
      favourite: p.favourite,
      startedAt: p.startedAt.toISOString(),
      schedules: p.schedules.map((s) => ({
        id: s.id,
        plantId: s.plantId,
        feed: s.feed,
        everyDays: s.everyDays,
        activeMonths: s.activeMonths,
      })),
      lastFedAt: p.feedRecords[0]?.fedAt.toISOString(),
    }));
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const plant = await this.prisma.plant.findUnique({
      where: { id },
      include: {
        schedules: { orderBy: { id: 'asc' } },
        feedRecords: {
          orderBy: { fedAt: 'desc' },
          take: 10,
          include: { user: true },
        },
      },
    });
    if (!plant) {
      throw new NotFoundException(`Plant ${id} not found`);
    }
    return {
      id: plant.id,
      name: plant.name,
      nick: plant.nick,
      location: plant.location,
      feedNote: plant.feedNote,
      color: plant.color,
      initial: plant.initial,
      favourite: plant.favourite,
      startedAt: plant.startedAt.toISOString(),
      schedules: plant.schedules.map((s) => ({
        id: s.id,
        plantId: s.plantId,
        feed: s.feed,
        everyDays: s.everyDays,
        activeMonths: s.activeMonths,
      })),
      history: plant.feedRecords.map((r) => ({
        id: r.id,
        feed: r.feed,
        fedAt: r.fedAt.toISOString(),
        dueDate: r.dueDate.toISOString(),
        by: { id: r.user.id, slug: r.user.slug, name: r.user.name },
      })),
    };
  }
}
