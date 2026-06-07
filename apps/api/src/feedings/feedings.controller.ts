import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { addDays, isoDate, parseIso } from '@longstone/shared';
import { GardenUser } from '../garden-user/garden-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateFeedingDto, CreateSnoozeDto } from './feedings.dto';

@Controller()
export class FeedingsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  @Post('feedings')
  async markFed(@GardenUser() slug: string, @Body() body: CreateFeedingDto) {
    const user = await this.users.resolveBySlug(slug);
    const plant = await this.prisma.plant.findUnique({
      where: { id: body.plantId },
      include: { schedules: true },
    });
    if (!plant) throw new NotFoundException(`Plant ${body.plantId} not found`);
    const matches = plant.schedules.some((s) => s.feed === body.feed);
    if (!matches) {
      throw new BadRequestException(
        `Feed "${body.feed}" is not on plant ${plant.id}'s schedule`,
      );
    }
    const fedAt = body.fedAt ? new Date(body.fedAt) : new Date();
    const dueDate = parseIso(body.dueDate.slice(0, 10));

    const record = await this.prisma.feedRecord.create({
      data: {
        plantId: plant.id,
        byUserId: user.id,
        feed: body.feed,
        fedAt,
        dueDate,
      },
    });
    return {
      id: record.id,
      plantId: record.plantId,
      byUserId: record.byUserId,
      feed: record.feed,
      fedAt: record.fedAt.toISOString(),
      dueDate: record.dueDate.toISOString(),
    };
  }

  @Post('snooze')
  async snooze(@GardenUser() _slug: string, @Body() body: CreateSnoozeDto) {
    const plant = await this.prisma.plant.findUnique({
      where: { id: body.plantId },
      include: { schedules: true },
    });
    if (!plant) throw new NotFoundException(`Plant ${body.plantId} not found`);
    const matches = plant.schedules.some((s) => s.feed === body.feed);
    if (!matches) {
      throw new BadRequestException(
        `Feed "${body.feed}" is not on plant ${plant.id}'s schedule`,
      );
    }
    const dueDate = parseIso(body.dueDate.slice(0, 10));
    const deferTo = addDays(dueDate, body.days);

    const snooze = await this.prisma.snooze.upsert({
      where: {
        plantId_feed_dueDate: {
          plantId: body.plantId,
          feed: body.feed,
          dueDate,
        },
      },
      update: { deferToDate: deferTo },
      create: {
        plantId: body.plantId,
        feed: body.feed,
        dueDate,
        deferToDate: deferTo,
      },
    });
    return {
      id: snooze.id,
      plantId: snooze.plantId,
      feed: snooze.feed,
      dueDate: isoDate(snooze.dueDate),
      deferToDate: isoDate(snooze.deferToDate),
    };
  }
}
