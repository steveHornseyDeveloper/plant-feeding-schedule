import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PlantsModule } from './plants/plants.module';
import { ScheduleModule } from './schedule/schedule.module';
import { FeedingsModule } from './feedings/feedings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    PlantsModule,
    ScheduleModule,
    FeedingsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
