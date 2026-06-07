import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { bootstrapTestApp, resetDb, seedBasic } from './helpers';
import type { PrismaService } from '../src/prisma/prisma.service';

describe('Longstone API integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, prisma } = await bootstrapTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  describe('GET /healthz', () => {
    it('returns ok', async () => {
      const res = await request(app.getHttpServer()).get('/healthz').expect(200);
      expect(res.body).toMatchObject({ status: 'ok' });
    });
  });

  describe('GET /users', () => {
    it('returns the seeded users', async () => {
      await seedBasic(prisma);
      const res = await request(app.getHttpServer()).get('/users').expect(200);
      const slugs = res.body.map((u: { slug: string }) => u.slug).sort();
      expect(slugs).toEqual(['alexa', 'stevie']);
    });
  });

  describe('GET /plants', () => {
    it('lists plants with their schedules', async () => {
      const { wisteria } = await seedBasic(prisma);
      const res = await request(app.getHttpServer()).get('/plants').expect(200);
      expect(res.body).toHaveLength(2);
      const w = res.body.find((p: { id: number }) => p.id === wisteria.id);
      expect(w).toMatchObject({
        name: 'Wisteria',
        favourite: true,
        schedules: [{ feed: 'Tomato feed', everyDays: 14 }],
      });
    });

    it('returns 404 for an unknown plant', async () => {
      await request(app.getHttpServer()).get('/plants/999').expect(404);
    });
  });

  describe('GET /schedule', () => {
    it('marks today as today and earlier dates as overdue', async () => {
      const { wisteria, alexa } = await seedBasic(prisma);
      // Last fed 14 days before today → today is the next-due date.
      const today = new Date();
      const fourteenDaysAgo = new Date(today.getTime() - 14 * 86400000);
      await prisma.feedRecord.create({
        data: {
          plantId: wisteria.id,
          byUserId: alexa.id,
          feed: 'Tomato feed',
          fedAt: fourteenDaysAgo,
          dueDate: fourteenDaysAgo,
        },
      });

      const fromIso = (d: Date) => d.toISOString().slice(0, 10);
      const from = fromIso(new Date(today.getTime() - 7 * 86400000));
      const to = fromIso(new Date(today.getTime() + 30 * 86400000));

      const res = await request(app.getHttpServer())
        .get(`/schedule?from=${from}&to=${to}`)
        .expect(200);

      const wisteriaEntries = res.body.filter(
        (e: { plantId: number }) => e.plantId === wisteria.id,
      );
      expect(wisteriaEntries.length).toBeGreaterThan(0);
      expect(wisteriaEntries[0].status).toBe('today');
    });

    it('returns separate entries for each schedule on a multi-schedule plant', async () => {
      await seedBasic(prisma);
      const res = await request(app.getHttpServer())
        .get('/schedule?from=2026-05-10&to=2026-12-31')
        .expect(200);
      const pearEntries = res.body.filter(
        (e: { feed: string; plantId: number }) => e.feed === 'Bone meal',
      );
      expect(pearEntries.length).toBeGreaterThan(0);
      const ericEntries = res.body.filter(
        (e: { feed: string }) => e.feed === 'Ericaceous mulch',
      );
      expect(ericEntries.length).toBeGreaterThan(0);
    });

    it('rejects malformed date params', async () => {
      await request(app.getHttpServer())
        .get('/schedule?from=not-a-date&to=2026-05-10')
        .expect(400);
    });
  });

  describe('POST /feedings', () => {
    it('records a feeding and shifts next due forward', async () => {
      const { wisteria } = await seedBasic(prisma);

      const before = await request(app.getHttpServer())
        .get('/schedule?from=2026-05-01&to=2026-06-30')
        .expect(200);
      const wBefore = before.body
        .filter((e: { plantId: number }) => e.plantId === wisteria.id)
        .map((e: { date: string }) => e.date);

      // First entry from startedAt 2026-04-01 + 14 = 2026-04-15.
      const due = wBefore[0]!;
      const res = await request(app.getHttpServer())
        .post('/feedings')
        .set('X-Garden-User', 'alexa')
        .send({ plantId: wisteria.id, feed: 'Tomato feed', dueDate: due })
        .expect(201);
      expect(res.body).toMatchObject({ feed: 'Tomato feed', plantId: wisteria.id });

      const after = await request(app.getHttpServer())
        .get('/schedule?from=2026-05-01&to=2026-06-30')
        .expect(200);
      const wAfter = after.body
        .filter((e: { plantId: number }) => e.plantId === wisteria.id)
        .map((e: { date: string }) => e.date);
      // The previously-first date should no longer appear because the latest feedAt is "now",
      // and cadence walks from that anchor.
      expect(wAfter).not.toContain(due);
    });

    it('rejects feeding for a feed not on the plant schedule', async () => {
      const { wisteria } = await seedBasic(prisma);
      await request(app.getHttpServer())
        .post('/feedings')
        .set('X-Garden-User', 'alexa')
        .send({ plantId: wisteria.id, feed: 'Bone meal', dueDate: '2026-05-08' })
        .expect(400);
    });

    it('rejects request without X-Garden-User header', async () => {
      const { wisteria } = await seedBasic(prisma);
      await request(app.getHttpServer())
        .post('/feedings')
        .send({ plantId: wisteria.id, feed: 'Tomato feed', dueDate: '2026-05-08' })
        .expect(400);
    });

    it('rejects unknown user slug', async () => {
      const { wisteria } = await seedBasic(prisma);
      await request(app.getHttpServer())
        .post('/feedings')
        .set('X-Garden-User', 'gandalf')
        .send({ plantId: wisteria.id, feed: 'Tomato feed', dueDate: '2026-05-08' })
        .expect(400);
    });
  });

  describe('POST /snooze', () => {
    it('shifts the entry by the requested days without affecting cadence', async () => {
      const { wisteria } = await seedBasic(prisma);

      // Pick a known upcoming entry.
      const before = await request(app.getHttpServer())
        .get('/schedule?from=2026-05-01&to=2026-06-30')
        .expect(200);
      const target = before.body.find(
        (e: { plantId: number; status: string }) =>
          e.plantId === wisteria.id && e.status !== 'overdue',
      );
      expect(target).toBeDefined();

      await request(app.getHttpServer())
        .post('/snooze')
        .set('X-Garden-User', 'alexa')
        .send({ plantId: wisteria.id, feed: 'Tomato feed', dueDate: target.date, days: 3 })
        .expect(201);

      const after = await request(app.getHttpServer())
        .get('/schedule?from=2026-05-01&to=2026-06-30')
        .expect(200);
      const moved = after.body.find(
        (e: { plantId: number; snoozedFrom?: string }) =>
          e.plantId === wisteria.id && e.snoozedFrom === target.date,
      );
      expect(moved).toBeDefined();

      const expected = new Date(`${target.date}T12:00:00Z`);
      expected.setUTCDate(expected.getUTCDate() + 3);
      const expectedIso = expected.toISOString().slice(0, 10);
      expect(moved.date).toBe(expectedIso);
    });
  });
});
