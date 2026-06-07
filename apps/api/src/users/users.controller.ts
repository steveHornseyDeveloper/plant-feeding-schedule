import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list() {
    const users = await this.prisma.user.findMany({ orderBy: { id: 'asc' } });
    return users.map((u) => ({
      id: u.id,
      slug: u.slug,
      name: u.name,
      initial: u.initial,
      tone: u.tone,
    }));
  }
}
