// Direction A — "Verdure"
// Green-led, watercolor washes, organic blobs, warm cream cards.
// Limestone hint = subtle drystone-wall divider strip.

const VERDURE = {
  bg:        '#f8f5ec',
  bgDeep:    '#eee8d6',
  ink:       '#1f2e23',
  inkSoft:   '#3a4d3f',
  moss:      '#3f6b4a',
  leaf:      '#5a8e54',
  bloom:     '#c79a4a',
  wisteria:  '#7a5b8e',
  card:      '#fffdf8',
  cardEdge:  'rgba(63, 107, 74, 0.12)',
  stoneSoft: '#e3dac3',
};

const verdureFonts = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Sora:wght@300;400;500;600&display=swap');
`;

// Decorative top of every screen — watercolor wash + scripted wordmark.
function VerdureHeader({ title, subtitle, accent = VERDURE.leaf, stoneIntensity = 1 }) {
  return (
    <div style={{ position: 'relative', padding: '22px 22px 10px' }}>
      {/* watercolor blooms behind */}
      <Watercolor color={accent} opacity={0.28} seed={3}
        style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220 }}/>
      <Watercolor color={VERDURE.bloom} opacity={0.18} seed={5}
        style={{ position: 'absolute', top: 30, left: -50, width: 170, height: 170 }}/>
      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: 'Sora, system-ui', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: VERDURE.moss, opacity: 0.7,
        }}>
          {subtitle}
        </div>
        <div style={{
          fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 38, lineHeight: 1.05,
          color: VERDURE.ink, letterSpacing: '-0.02em', marginTop: 2,
        }}>
          {title}
        </div>
      </div>
    </div>
  );
}

// Drystone divider — visible-but-quiet limestone band.
function VerdureDrystone({ intensity = 1, w = 350 }) {
  if (intensity <= 0) return <div style={{ height: 8 }}/>;
  return (
    <div style={{
      padding: '6px 16px 10px',
      opacity: 0.55 + intensity * 0.45,
      filter: `saturate(${0.6 + intensity * 0.4})`,
    }}>
      <Drystone rows={2} w={w} h={18 + intensity * 6} intensity={intensity}/>
    </div>
  );
}

// Today task card — featured at top of feed list. Includes mark-fed swipe affordance.
function VerdureTaskCard({ task, onMarkFed, fed, fedBy }) {
  // eslint-disable-next-line
  const overdue = task.status === 'overdue';
  return (
    <div style={{
      position: 'relative',
      background: VERDURE.card,
      border: `1px solid ${overdue ? '#c47a4a55' : VERDURE.cardEdge}`,
      borderRadius: 18, padding: '14px 14px 12px',
      boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 18px rgba(63,107,74,0.06)',
      overflow: 'hidden',
    }}>
      {/* Watercolor accent in corner */}
      <Watercolor color={task.plant.color} opacity={0.22} seed={task.plant.id.length}
        style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, pointerEvents: 'none' }}/>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
        <PlantBadge plant={task.plant} size={48}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{
              fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 22, color: VERDURE.ink,
              letterSpacing: '-0.01em', lineHeight: 1.1, whiteSpace: 'nowrap',
            }}>{task.plant.name}</div>
            {task.plant.favourite && <span style={{ color: VERDURE.wisteria, fontSize: 13 }}>✦</span>}
          </div>
          <div style={{
            fontFamily: 'Sora, system-ui', fontSize: 12, color: VERDURE.inkSoft,
            opacity: 0.7, marginTop: 1,
          }}>{task.plant.location}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: overdue ? '#c47a4a' : VERDURE.leaf,
            }}/>
            <span style={{
              fontFamily: 'Sora, system-ui', fontSize: 13, color: VERDURE.ink, fontWeight: 500,
            }}>{task.feed}</span>
            <span style={{ color: VERDURE.inkSoft, opacity: 0.4, fontSize: 12 }}>·</span>
            <span style={{
              fontFamily: 'Sora, system-ui', fontSize: 12,
              color: overdue ? '#a85a2a' : VERDURE.inkSoft,
              fontStyle: overdue ? 'italic' : 'normal',
            }}>
              {overdue ? `${Math.abs(Math.round((new Date(task.date) - TODAY)/86400000))} days overdue` : 'Due today'}
            </span>
          </div>
        </div>
      </div>
      {/* feed action */}
      <div style={{
        marginTop: 12, display: 'flex', gap: 8, alignItems: 'center',
      }}>
        {fed ? (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 12,
            background: `${VERDURE.leaf}15`, border: `1px solid ${VERDURE.leaf}30`,
          }}>
            <UserDot user={fedBy} size={20}/>
            <span style={{
              fontFamily: 'Sora, system-ui', fontSize: 13, color: VERDURE.moss, fontWeight: 500,
            }}>{fedBy.name} fed · just now</span>
            <LeafGlyph size={14} color={VERDURE.leaf} style={{ marginLeft: 'auto' }}/>
          </div>
        ) : (
          <>
            <button onClick={() => onMarkFed('alex')} style={{
              flex: 1, padding: '10px 12px', border: 'none', borderRadius: 12,
              background: VERDURE.moss, color: '#fffdf8',
              fontFamily: 'Sora, system-ui', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer',
            }}>
              <LeafGlyph size={12} color="#fffdf8" tilt={-25}/>
              Mark fed
            </button>
            <button style={{
              padding: '10px 12px', border: `1px solid ${VERDURE.cardEdge}`,
              borderRadius: 12, background: 'transparent', color: VERDURE.inkSoft,
              fontFamily: 'Sora, system-ui', fontSize: 13,
              cursor: 'pointer',
            }}>Snooze</button>
          </>
        )}
      </div>
    </div>
  );
}

// Quieter row used for Upcoming + Calendar.
function VerdureRow({ task, dim = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 6px', borderBottom: `1px solid ${VERDURE.cardEdge}`,
      opacity: dim ? 0.55 : 1,
    }}>
      <PlantBadge plant={task.plant} size={32}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 16, color: VERDURE.ink,
          lineHeight: 1.1,
        }}>{task.plant.name}</div>
        <div style={{
          fontFamily: 'Sora, system-ui', fontSize: 11.5, color: VERDURE.inkSoft, opacity: 0.75,
          marginTop: 1,
        }}>{task.feed}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'Sora, system-ui', fontSize: 12, color: VERDURE.moss, fontWeight: 500,
        }}>{relWhen(task.date)}</div>
        <div style={{
          fontFamily: 'Sora, system-ui', fontSize: 10.5, color: VERDURE.inkSoft, opacity: 0.5,
        }}>{fmtDay(task.date)}</div>
      </div>
    </div>
  );
}

// ── HOME / TODAY screen ──────────────────────────────────────────────────
function VerdureToday({ stoneIntensity = 1, fedMap = {}, onMarkFed = () => {} }) {
  const todays = getTodayTasks();
  const upcoming = getUpcomingTasks(14);

  return (
    <div style={{
      background: VERDURE.bg, minHeight: '100%',
      fontFamily: 'Sora, system-ui',
      paddingBottom: 90,
    }}>
      {/* header */}
      <div style={{ height: 62 }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 22px 0' }}>
        <div style={{
          fontFamily: '"DM Serif Display", Georgia, serif', fontStyle: 'italic',
          fontSize: 18, color: VERDURE.moss, letterSpacing: '-0.01em',
        }}>Longstone Garden</div>
        <div style={{ flex: 1 }}/>
        <UserDot user={USERS.alex} size={26}/>
        <UserDot user={USERS.jamie} size={26} style={{ marginLeft: -8 }}/>
      </div>
      <VerdureHeader title="Today's feed" subtitle={`${fmtDay('2026-05-10')} · 5 plants`}/>
      <VerdureDrystone intensity={stoneIntensity} w={350}/>

      {/* Today's tasks */}
      <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {todays.map(t => {
          const key = `${t.plant.id}-${t.schedIndex}`;
          return (
            <VerdureTaskCard key={key} task={t}
              fed={!!fedMap[key]} fedBy={fedMap[key] ? USERS[fedMap[key]] : null}
              onMarkFed={(u) => onMarkFed(key, u)}/>
          );
        })}
      </div>

      {/* Upcoming */}
      <div style={{ padding: '24px 22px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
        }}>
          <Tendril w={28} h={12} color={VERDURE.moss}/>
          <div style={{
            fontFamily: 'Sora, system-ui', fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: VERDURE.moss, opacity: 0.85,
          }}>Coming up</div>
        </div>
        <div style={{ background: VERDURE.card, borderRadius: 14, padding: '4px 12px',
                      border: `1px solid ${VERDURE.cardEdge}` }}>
          {upcoming.slice(0, 4).map((t, i) => (
            <VerdureRow key={`${t.plant.id}-${i}`} task={t}/>
          ))}
        </div>
      </div>

      {/* tab bar */}
      <VerdureTabBar active="today"/>
    </div>
  );
}

// ── CALENDAR screen ──────────────────────────────────────────────────────
function VerdureCalendar({ stoneIntensity = 1 }) {
  const monthDays = 31;
  const startDow = 5; // May 2026 starts Friday
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= monthDays; d++) cells.push(d);
  // map of day -> tasks
  const byDay = {};
  PLANTS.forEach(p => p.schedule.forEach(s => {
    const d = new Date(s.date);
    if (d.getMonth() === 4 && d.getFullYear() === 2026) {
      const k = d.getDate();
      (byDay[k] ||= []).push({ plant: p, ...s });
    }
  }));
  const todayDay = 10;

  return (
    <div style={{
      background: VERDURE.bg, minHeight: '100%', fontFamily: 'Sora, system-ui',
      paddingBottom: 90,
    }}>
      <div style={{ height: 62 }}/>
      <div style={{ padding: '8px 22px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          fontFamily: '"DM Serif Display", Georgia, serif', fontStyle: 'italic',
          fontSize: 18, color: VERDURE.moss,
        }}>Longstone Garden</div>
        <div style={{ flex: 1 }}/>
        <UserDot user={USERS.alex} size={26}/>
        <UserDot user={USERS.jamie} size={26} style={{ marginLeft: -8 }}/>
      </div>
      <VerdureHeader title="May 2026" subtitle="The feeding month"/>
      <VerdureDrystone intensity={stoneIntensity} w={350}/>

      {/* week heads */}
      <div style={{ padding: '6px 16px 0', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontFamily: 'Sora, system-ui', fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: VERDURE.inkSoft, opacity: 0.6,
          }}>{d}</div>
        ))}
      </div>
      {/* grid */}
      <div style={{
        padding: '4px 14px 0',
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4,
      }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} style={{ aspectRatio: '1' }}/>;
          const tasks = byDay[d] || [];
          const isToday = d === todayDay;
          const hasOverdue = tasks.some(t => t.status === 'overdue');
          return (
            <div key={i} style={{
              aspectRatio: '1', position: 'relative',
              borderRadius: 9, padding: 4,
              background: isToday ? VERDURE.moss : (tasks.length ? VERDURE.card : 'transparent'),
              border: tasks.length && !isToday ? `1px solid ${VERDURE.cardEdge}` : 'none',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 13, fontWeight: 400,
                color: isToday ? '#fffdf8' : (hasOverdue ? '#a85a2a' : VERDURE.ink),
              }}>{d}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, marginTop: 2 }}>
                {tasks.slice(0, 3).map((t, j) => (
                  <span key={j} style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: isToday ? '#fffdf8' : t.plant.color,
                  }}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected day list */}
      <div style={{ padding: '20px 22px 0' }}>
        <div style={{
          fontFamily: 'Sora, system-ui', fontSize: 11, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: VERDURE.moss, opacity: 0.85,
          marginBottom: 8,
        }}>Sun 10 May · today</div>
        <div style={{ background: VERDURE.card, borderRadius: 14, padding: '2px 12px',
                      border: `1px solid ${VERDURE.cardEdge}` }}>
          {(byDay[10] || []).map((t, i) => (
            <VerdureRow key={i} task={{ ...t, plant: t.plant }}/>
          ))}
        </div>
      </div>

      <VerdureTabBar active="calendar"/>
    </div>
  );
}

// Floating-ish bottom tab bar (botanical, watercolor).
function VerdureTabBar({ active }) {
  const Tab = ({ id, label, glyph }) => {
    const on = id === active;
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        padding: '8px 0',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: on ? `${VERDURE.moss}` : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LeafGlyph size={16} color={on ? '#fffdf8' : VERDURE.moss}
            tilt={id === 'today' ? -20 : id === 'calendar' ? 10 : 35}/>
        </div>
        <div style={{
          fontFamily: 'Sora, system-ui', fontSize: 10,
          color: on ? VERDURE.moss : VERDURE.inkSoft,
          fontWeight: on ? 600 : 400,
          letterSpacing: '0.04em',
        }}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: 16, right: 16,
      borderRadius: 22, background: 'rgba(255,253,248,0.92)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${VERDURE.cardEdge}`,
      boxShadow: '0 10px 30px rgba(63,107,74,0.12)',
      display: 'flex', padding: '2px 6px',
    }}>
      <Tab id="today" label="Today" glyph="leaf"/>
      <Tab id="calendar" label="Calendar" glyph="moon"/>
      <Tab id="plants" label="Plants" glyph="seed"/>
    </div>
  );
}

Object.assign(window, {
  VERDURE, verdureFonts, VerdureToday, VerdureCalendar, VerdureTabBar,
});
