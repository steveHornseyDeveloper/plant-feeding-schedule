import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveBySlug(slug: string) {
    const user = await this.prisma.user.findUnique({ where: { slug } });
    if (!user) {
      throw new BadRequestException(`Unknown user slug: ${slug}`);
    }
    return user;
  }
}
