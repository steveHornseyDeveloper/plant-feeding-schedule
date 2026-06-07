// Shared plant data and helpers across both design directions.
// Today is May 10, 2026 — Peak District spring, peak feeding season.

const TODAY = new Date(2026, 4, 10); // May 10

const PLANTS = [
  {
    id: 'wisteria',
    name: 'Wisteria',
    nick: 'The Pride',
    location: 'South wall · pergola',
    feed: 'Tomato feed',
    feedNote: 'High-potash for flowering',
    color: '#9b86c4',
    initial: 'W',
    favourite: true,
    schedule: [
      { date: '2026-05-08', feed: 'Tomato feed', done: false, status: 'overdue' },
      { date: '2026-05-22', feed: 'Tomato feed', done: false, status: 'upcoming' },
      { date: '2026-06-05', feed: 'Tomato feed', done: false, status: 'upcoming' },
      { date: '2026-06-19', feed: 'Tomato feed', done: false, status: 'upcoming' },
    ],
    history: [
      { date: '2026-04-24', feed: 'Tomato feed', by: 'Jamie' },
      { date: '2026-04-10', feed: 'Seaweed',     by: 'Alex'  },
    ],
  },
  {
    id: 'peach',
    name: 'Peach tree',
    nick: 'Stable end',
    location: 'East border · espalier',
    feed: 'Seaweed',
    feedNote: 'Foliar spray, fortnightly',
    color: '#e6a78b',
    initial: 'P',
    schedule: [
      { date: '2026-05-10', feed: 'Seaweed', done: false, status: 'today' },
      { date: '2026-05-24', feed: 'Seaweed', done: false, status: 'upcoming' },
    ],
    history: [
      { date: '2026-04-26', feed: 'Seaweed', by: 'Alex' },
    ],
  },
  {
    id: 'fig',
    name: 'Fig tree',
    nick: 'Greenhouse',
    location: 'Greenhouse · west bed',
    feed: 'Tomato feed',
    feedNote: 'Weekly once fruit sets',
    color: '#7fae6c',
    initial: 'F',
    schedule: [
      { date: '2026-05-10', feed: 'Tomato feed', done: false, status: 'today' },
      { date: '2026-05-17', feed: 'Tomato feed', done: false, status: 'upcoming' },
      { date: '2026-05-24', feed: 'Tomato feed', done: false, status: 'upcoming' },
    ],
    history: [
      { date: '2026-05-03', feed: 'Tomato feed', by: 'Jamie' },
    ],
  },
  {
    id: 'pear',
    name: 'Pear trees',
    nick: 'Two of',
    location: 'Orchard · north row',
    feed: 'Bone meal',
    feedNote: 'Slow release · root drench',
    color: '#b9c47a',
    initial: 'Pr',
    schedule: [
      { date: '2026-05-13', feed: 'Ericaceous mulch', done: false, status: 'upcoming' },
      { date: '2026-10-04', feed: 'Bone meal',        done: false, status: 'upcoming' },
    ],
    history: [
      { date: '2026-03-12', feed: 'Bone meal', by: 'Alex' },
    ],
  },
  {
    id: 'apple',
    name: 'Apple trees',
    nick: 'Three of',
    location: 'Orchard · south row',
    feed: 'Bone meal',
    feedNote: 'Autumn drench',
    color: '#c4d18a',
    initial: 'A',
    schedule: [
      { date: '2026-05-13', feed: 'Ericaceous mulch', done: false, status: 'upcoming' },
      { date: '2026-10-04', feed: 'Bone meal',        done: false, status: 'upcoming' },
    ],
    history: [
      { date: '2026-03-12', feed: 'Bone meal', by: 'Jamie' },
    ],
  },
];

// Today / overdue tasks across all plants, ordered by urgency.
function getTodayTasks() {
  const out = [];
  PLANTS.forEach(p => {
    p.schedule.forEach((s, i) => {
      if (s.status === 'overdue' || s.status === 'today') {
        out.push({ plant: p, schedIndex: i, ...s });
      }
    });
  });
  return out.sort((a, b) => (a.status === 'overdue' ? -1 : 1) - (b.status === 'overdue' ? -1 : 1));
}

// Next 14 days of upcoming tasks (post-today).
function getUpcomingTasks(days = 14) {
  const cutoff = new Date(TODAY);
  cutoff.setDate(cutoff.getDate() + days);
  const out = [];
  PLANTS.forEach(p => {
    p.schedule.forEach((s, i) => {
      const d = new Date(s.date);
      if (s.status === 'upcoming' && d <= cutoff && d > TODAY) {
        out.push({ plant: p, schedIndex: i, ...s });
      }
    });
  });
  return out.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function fmtDay(dateStr) {
  const d = new Date(dateStr);
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function relWhen(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.round((d - TODAY) / 86400000);
  if (diff < -1) return `${-diff} days overdue`;
  if (diff === -1) return 'Yesterday';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7) return `In ${diff} days`;
  return fmtDay(dateStr);
}

// Two-user system. Avatar colors lean botanical.
const USERS = {
  alex:  { name: 'Alex',  initial: 'A', tone: '#3f6b4a' },
  jamie: { name: 'Jamie', initial: 'J', tone: '#7a5b8e' },
};

Object.assign(window, { PLANTS, USERS, TODAY, getTodayTasks, getUpcomingTasks, fmtDay, relWhen });
