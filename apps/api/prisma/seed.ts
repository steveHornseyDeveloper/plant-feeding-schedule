import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.snooze.deleteMany();
  await prisma.feedRecord.deleteMany();
  await prisma.feedingSchedule.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.user.deleteMany();

  const stevie = await prisma.user.create({
    data: { slug: 'stevie', name: 'Stevie', initial: 'S', tone: '#7a5b8e' },
  });

  // Anchor "today": 2026-05-23. Spring feeds started late March / early April
  // based on the Notion task lists. This seed contains ONLY outstanding /
  // upcoming feeds. Anything already completed (March rose feed, March/April
  // soft fruit manure mulches, April young wisteria feed, May fig feed,
  // October 2025 apple bone meal) is excluded so the app shows a clean
  // forward-looking schedule.

  const springStart = new Date('2026-03-01T12:00:00Z');

  // 1. Brown Turkey fig (pot, greenhouse) - high-potash tomato feed.
  //    Fortnightly Mar-May, weekly Jun-Aug. Spring fortnightly cycle is in
  //    progress (next due ~30 May) and the weekly summer cadence kicks in
  //    from 1 June. All forward-looking.
  await prisma.plant.create({
    data: {
      name: 'Brown Turkey fig',
      nick: 'In greenhouse',
      location: 'Greenhouse · back garden',
      feedNote: 'High-potash liquid · fortnightly spring, weekly summer',
      color: '#6b8e4e',
      initial: 'Fg',
      favourite: true,
      startedAt: new Date('2026-04-04T12:00:00Z'),
      schedules: {
        create: [
          { feed: 'Tomato feed', everyDays: 14, activeMonths: [3, 4, 5] },
          { feed: 'Tomato feed', everyDays: 7,  activeMonths: [6, 7, 8] },
        ],
      },
    },
  });

  // 2. Peach tree - balanced spring feed. OVERDUE: carried over from
  //    Sat 28th March and Sat 4th April task lists, never applied.
  await prisma.plant.create({
    data: {
      name: 'Peach tree',
      nick: 'One of',
      location: 'Front of house beds',
      feedNote: 'Balanced spring feed · mulch clear of trunk',
      color: '#e6a78b',
      initial: 'Pe',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Growmore (balanced)', everyDays: 30, activeMonths: [3, 4] },
        ],
      },
    },
  });

  // 3. Apple trees (established, productive) - full four-phase regime.
  //    Spring balanced N is already past its window but May-Jun potash,
  //    Jun-Jul foliar seaweed, and Oct ripening feeds are all upcoming.
  await prisma.plant.create({
    data: {
      name: 'Apple trees',
      nick: 'Established · productive',
      location: 'Garden · orchard',
      feedNote: 'Four-phase · spring N · summer K · foliar · autumn ripening',
      color: '#a8c66c',
      initial: 'Ap',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Growmore (balanced)', everyDays: 30, activeMonths: [3, 4] },
          { feed: 'Sulphate of potash',  everyDays: 30, activeMonths: [5, 6] },
          { feed: 'Seaweed (foliar)',    everyDays: 21, activeMonths: [6, 7] },
          { feed: 'Sulphate of potash',  everyDays: 30, activeMonths: [10] },
          { feed: 'Bone meal',           everyDays: 30, activeMonths: [10] },
        ],
      },
    },
  });

  // 4. Pear espaliers (establishing) - light regime, framework focus.
  //    May-Jul seaweed foliar and Oct bone meal are all upcoming.
  await prisma.plant.create({
    data: {
      name: 'Pear espaliers',
      nick: 'Two of · establishing',
      location: 'Long stone wall',
      feedNote: 'Light regime · framework first · root drench',
      color: '#b9c47a',
      initial: 'Pr',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Growmore (balanced)', everyDays: 30, activeMonths: [3, 4] },
          { feed: 'Seaweed (foliar)',    everyDays: 30, activeMonths: [5, 6, 7] },
          { feed: 'Bone meal',           everyDays: 30, activeMonths: [10] },
        ],
      },
    },
  });

  // 5. Currants - manure mulch was done in March, but sulphate of potash and
  //    balanced N for blackcurrants were NOT applied. These remain outstanding
  //    for this spring and recur next year. Schedule kept intact for cadence.
  await prisma.plant.create({
    data: {
      name: 'Currants',
      nick: 'Black, red, white',
      location: 'Back garden · planters',
      feedNote: 'Spring potash + balanced N · still outstanding for 2026',
      color: '#6b2b3a',
      initial: 'Cr',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Well-rotted manure',            everyDays: 30, activeMonths: [3] },
          { feed: 'Composted bark fines (7-10cm)', everyDays: 30, activeMonths: [3] },
          { feed: 'Sulphate of potash',            everyDays: 30, activeMonths: [3] },
          { feed: 'Growmore (balanced)',           everyDays: 30, activeMonths: [3] },
        ],
      },
    },
  });

  // 6. Gooseberries - sulphate of potash for this spring still outstanding.
  await prisma.plant.create({
    data: {
      name: 'Gooseberries',
      nick: 'Back planter',
      location: 'Back garden · planters',
      feedNote: 'Manure mulch + spring potash',
      color: '#b8c97a',
      initial: 'Gb',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Well-rotted manure',            everyDays: 30, activeMonths: [3] },
          { feed: 'Composted bark fines (7-10cm)', everyDays: 30, activeMonths: [3] },
          { feed: 'Sulphate of potash',            everyDays: 30, activeMonths: [3] },
        ],
      },
    },
  });

  // 7. Raspberries - Feb potash window has passed for 2026 (will recur 2027).
  //    Manure mulch done 28 Mar. Schedule kept for future cycles.
  await prisma.plant.create({
    data: {
      name: 'Raspberries',
      nick: 'Back planter',
      location: 'Back garden · back planter',
      feedNote: 'Feb potash · spring manure · NO feed after end of June',
      color: '#a8385c',
      initial: 'Rb',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Sulphate of potash',            everyDays: 30, activeMonths: [2] },
          { feed: 'Well-rotted manure',            everyDays: 30, activeMonths: [3] },
          { feed: 'Composted bark fines (7-10cm)', everyDays: 30, activeMonths: [3] },
        ],
      },
    },
  });

  // 8. Blackberries - same family logic as raspberries.
  await prisma.plant.create({
    data: {
      name: 'Blackberries',
      nick: 'Back planter',
      location: 'Back garden · back planter',
      feedNote: 'Spring potash + manure mulch · NO late summer feed',
      color: '#2a1a3e',
      initial: 'Bb',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Sulphate of potash',            everyDays: 30, activeMonths: [2] },
          { feed: 'Well-rotted manure',            everyDays: 30, activeMonths: [3] },
          { feed: 'Composted bark fines (7-10cm)', everyDays: 30, activeMonths: [3] },
        ],
      },
    },
  });

  // 9. Asparagus - spring manure done 28 Mar. Post-harvest balanced feed
  //    (Jun-Jul) and autumn manure (Oct) are upcoming.
  await prisma.plant.create({
    data: {
      name: 'Asparagus',
      nick: 'Bottom & middle',
      location: 'Back garden · bottom & middle planters',
      feedNote: 'Spring + autumn manure · post-harvest balanced feed for ferns',
      color: '#7a9a4f',
      initial: 'As',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Well-rotted manure',            everyDays: 30, activeMonths: [3] },
          { feed: 'Composted bark fines (7-10cm)', everyDays: 30, activeMonths: [3] },
          { feed: 'Growmore (balanced)',           everyDays: 30, activeMonths: [6, 7] },
          { feed: 'Well-rotted manure',            everyDays: 30, activeMonths: [10] },
        ],
      },
    },
  });

  // 10. Rhubarb - spring manure done 4 Apr. Late spring general feed (May)
  //     and autumn manure (Oct) are upcoming. May feed is imminent.
  await prisma.plant.create({
    data: {
      name: 'Rhubarb',
      nick: 'Very early variety',
      location: 'Middle planter · left side',
      feedNote: 'Hungry feeder · avoid high N (triggers bolting)',
      color: '#c64b5c',
      initial: 'Rh',
      favourite: true,
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Well-rotted manure',            everyDays: 30, activeMonths: [3] },
          { feed: 'Composted bark fines (7-10cm)', everyDays: 30, activeMonths: [3] },
          { feed: 'Growmore (balanced)',           everyDays: 30, activeMonths: [5] },
          { feed: 'Well-rotted manure',            everyDays: 30, activeMonths: [10] },
        ],
      },
    },
  });

  // 11. Hydrangeas - ericaceous feed OVERDUE from 4 April task list, never
  //     applied. Monthly aluminium sulphate Mar-Aug, all unfulfilled so far.
  await prisma.plant.create({
    data: {
      name: 'Hydrangeas',
      nick: 'Driveway border',
      location: 'Front garden · driveway border',
      feedNote: 'Ericaceous in spring · monthly Al sulphate for blue',
      color: '#6a87b8',
      initial: 'Hy',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Ericaceous fertiliser',        everyDays: 30, activeMonths: [3, 4] },
          { feed: 'Aluminium sulphate (monthly)', everyDays: 30, activeMonths: [3, 4, 5, 6, 7, 8] },
        ],
      },
    },
  });

  // 12. Roses - spring feed done 28 Mar. Mid-summer feed (Jul) upcoming.
  await prisma.plant.create({
    data: {
      name: 'Roses',
      nick: 'Climbers · jacket-killer',
      location: 'Patio · front door',
      feedNote: 'Spring + mid-summer feed for repeat flush',
      color: '#d4779e',
      initial: 'Ro',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Rose fertiliser', everyDays: 30, activeMonths: [3, 4] },
          { feed: 'Rose fertiliser', everyDays: 30, activeMonths: [7] },
        ],
      },
    },
  });

  // 13. Passiflora caerulea - intentionally minimal. Spring slow-release
  //     window has passed for 2026 but the schedule recurs next year.
  await prisma.plant.create({
    data: {
      name: 'Passiflora caerulea',
      nick: 'Blue passionflower',
      location: 'Southwest wall · trellis',
      feedNote: 'Balanced slow-release · avoid high nitrogen',
      color: '#7a6bb8',
      initial: 'Ps',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Growmore (balanced)', everyDays: 30, activeMonths: [3] },
        ],
      },
    },
  });

  // 14. Young Wisteria - April balanced feed done 4 Apr. May and June
  //     balanced feeds still upcoming to support establishment.
  await prisma.plant.create({
    data: {
      name: 'Wisteria (young)',
      nick: 'Establishing · 6+ months',
      location: 'Narrow end of house · southwest wall',
      feedNote: 'Balanced feed · supports root + framework establishment',
      color: '#b794d0',
      initial: 'Wy',
      startedAt: new Date('2026-04-04T12:00:00Z'),
      schedules: {
        create: [
          { feed: 'Growmore (balanced)', everyDays: 30, activeMonths: [4, 5, 6] },
        ],
      },
    },
  });

  // 15. Established Wisteria - NOT in Notion care guide. No feeding has
  //     happened. Spring balanced N + Mar/Apr potash are OVERDUE; Jun/Jul
  //     summer potash is upcoming.
  await prisma.plant.create({
    data: {
      name: 'Wisteria (established)',
      nick: 'Southwest wall · trained',
      location: 'Southwest wall',
      feedNote: 'Spring K + summer K for flowering · avoid high N (legume)',
      color: '#9b86c4',
      initial: 'We',
      startedAt: springStart,
      schedules: {
        create: [
          { feed: 'Growmore (balanced)', everyDays: 30, activeMonths: [3] },
          { feed: 'Sulphate of potash',  everyDays: 30, activeMonths: [3, 4] },
          { feed: 'Sulphate of potash',  everyDays: 30, activeMonths: [6, 7] },
        ],
      },
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());