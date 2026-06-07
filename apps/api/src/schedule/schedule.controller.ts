import { Controller, Get, Query } from '@nestjs/common';
import { IsISO8601 } from 'class-validator';
import { ScheduleService } from './schedule.service';

class ScheduleQuery {
  @IsISO8601({ strict: false })
  from!: string;

  @IsISO8601({ strict: false })
  to!: string;
}

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly schedule: ScheduleService) {}

  @Get()
  async window(@Query() q: ScheduleQuery) {
    const from = q.from.slice(0, 10);
    const to = q.to.slice(0, 10);
    return this.schedule.forWindow(from, to);
  }
}
