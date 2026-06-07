import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FeedingsController } from './feedings.controller';

@Module({
  imports: [UsersModule],
  controllers: [FeedingsController],
})
export class FeedingsModule {}
