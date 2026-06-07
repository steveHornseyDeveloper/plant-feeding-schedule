import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

export async function bootstrapTestApp(): Promise<{ app: INestApplication; prisma: PrismaService }> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-Garden-User'],
  });
  await app.init();
  const prisma = app.get(PrismaService);
  return { app, prisma };
}

export async function resetDb(prisma: PrismaService) {
  await prisma.snooze.deleteMany();
  await prisma.feedRecord.deleteMany();
  await prisma.feedingSchedule.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.user.deleteMany();
}

export async function seedBasic(prisma: PrismaService) {
  const alexa = await prisma.user.create({
    data: { slug: 'alexa', name: 'Alexa', initial: 'A', tone: '#3f6b4a' },
  });
  const stevie = await prisma.user.create({
    data: { slug: 'stevie', name: 'Stevie', initial: 'S', tone: '#7a5b8e' },
  });
  const wisteria = await prisma.plant.create({
    data: {
      name: 'Wisteria',
      nick: 'The Pride',
      location: 'South wall · pergola',
      feedNote: 'High-potash for flowering',
      color: '#9b86c4',
      initial: 'W',
      favourite: true,
      startedAt: new Date('2026-04-01T12:00:00Z'),
      schedules: {
        create: [
          { feed: 'Tomato feed', everyDays: 14, activeMonths: [4, 5, 6, 7, 8, 9] },
        ],
      },
    },
    include: { schedules: true },
  });
  const pear = await prisma.plant.create({
    data: {
      name: 'Pear trees',
      nick: 'Two of',
      location: 'Orchard · north row',
      feedNote: 'Slow release · root drench',
      color: '#b9c47a',
      initial: 'Pr',
      startedAt: new Date('2026-04-13T12:00:00Z'),
      schedules: {
        create: [
          { feed: 'Ericaceous mulch', everyDays: 30, activeMonths: [3, 4, 5, 6] },
          { feed: 'Bone meal',        everyDays: 30, activeMonths: [10] },
        ],
      },
    },
    include: { schedules: true },
  });
  return { alexa, stevie, wisteria, pear };
}
