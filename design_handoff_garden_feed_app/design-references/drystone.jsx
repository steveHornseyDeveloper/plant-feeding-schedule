// Direction B — "Drystone"
// Limestone-led, architectural, stacked-stone sidebar motif, mossier greens.
// Editorial: think Edwardian botanical illustration meets drystone wall.

const DRYSTONE = {
  bg:        '#ede5d2',
  bgDeep:    '#e0d5bb',
  paper:     '#f6f0de',
  ink:       '#1a241d',
  inkSoft:   '#3d4a3f',
  moss:      '#2f4a35',
  lichen:    '#7c8b4a',
  stone:     '#c4b896',
  stoneDk:   '#8a7d5e',
  rust:      '#a05a30',
  wisteria:  '#5d4670',
};

// Header — drystone-textured top band with editorial eyebrow + title.
function DrystoneHeader({ title, eyebrow, stoneIntensity = 1 }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* drystone band along top */}
      <div style={{
        height: 60 + stoneIntensity * 14, position: 'relative', overflow: 'hidden',
        background: DRYSTONE.bgDeep,
      }}>
        <Drystone rows={2} w={400} h={60 + stoneIntensity * 14} intensity={Math.max(0.4, stoneIntensity)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(237,229,210,0.95) 100%)',
        }}/>
      </div>
      {/* heading sits on a creamy plinth */}
      <div style={{ padding: '10px 22px 14px', position: 'relative' }}>
        <div style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontStyle: 'italic', fontSize: 12, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: DRYSTONE.stoneDk, fontWeight: 500,
        }}>{eyebrow}</div>
        <div style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 500,
          fontSize: 40, lineHeight: 1.0, color: DRYSTONE.ink,
          letterSpacing: '-0.015em', marginTop: 4,
        }}>{title}</div>
      </div>
    </div>
  );
}

// Stone-tile task card — paper card on a stone plinth.
function DrystoneTaskCard({ task, fed, fedBy, onMarkFed }) {
  const overdue = task.status === 'overdue';
  return (
    <div style={{ position: 'relative', display: 'flex', gap: 0 }}>
      {/* drystone left rail (intensity-controlled in container CSS via opacity) */}
      <div className="ds-rail" style={{
        width: 14, position: 'relative', overflow: 'hidden', borderRadius: '6px 0 0 6px',
      }}>
        <Drystone rows={6} w={14} h={150} intensity={1.2}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}/>
      </div>
      <div style={{
        flex: 1, background: DRYSTONE.paper,
        border: `1px solid ${DRYSTONE.stoneDk}30`,
        borderLeft: 'none',
        borderRadius: '0 6px 6px 0',
        padding: '14px 14px 12px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* botanical wash */}
        <Watercolor color={task.plant.color} opacity={0.18} seed={task.plant.id.length + 1}
          style={{ position: 'absolute', top: -40, right: -30, width: 140, height: 140, pointerEvents: 'none' }}/>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
          <PlantBadge plant={task.plant} size={42}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 500,
                fontSize: 22, color: DRYSTONE.ink, lineHeight: 1.05, letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}>{task.plant.name}</div>
              {task.plant.favourite && (
                <span style={{
                  fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                  fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: DRYSTONE.wisteria,
                }}>· favourite</span>
              )}
            </div>
            <div style={{
              fontFamily: '"Inter", system-ui', fontSize: 11, color: DRYSTONE.inkSoft,
              opacity: 0.7, marginTop: 1, letterSpacing: '0.02em',
            }}>{task.plant.location}</div>
          </div>
          {/* status stamp */}
          <div style={{
            padding: '3px 8px', borderRadius: 999,
            border: `1px solid ${overdue ? DRYSTONE.rust : DRYSTONE.moss}`,
            color: overdue ? DRYSTONE.rust : DRYSTONE.moss,
            fontFamily: '"Inter", system-ui', fontSize: 9,
            letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>{overdue ? 'overdue' : 'today'}</div>
        </div>

        {/* feed line */}
        <div style={{
          marginTop: 12, padding: '8px 10px', borderRadius: 4,
          background: '#fffdf6', border: `1px solid ${DRYSTONE.stoneDk}25`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 3,
            background: `${task.plant.color}30`, color: DRYSTONE.moss,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Cormorant Garamond", serif', fontSize: 13, fontStyle: 'italic',
          }}>℟</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"Inter", system-ui', fontSize: 9, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: DRYSTONE.stoneDk, fontWeight: 600,
            }}>Prescription</div>
            <div style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 16,
              color: DRYSTONE.ink, lineHeight: 1.15, marginTop: -1,
            }}>{task.feed}</div>
          </div>
          <div style={{
            fontFamily: '"Inter", system-ui', fontSize: 10, color: DRYSTONE.inkSoft,
            textAlign: 'right', maxWidth: 90,
          }}>{task.plant.feedNote}</div>
        </div>

        {/* action */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {fed ? (
            <div style={{
              flex: 1, padding: '10px 12px', borderRadius: 4,
              background: `${DRYSTONE.moss}15`, border: `1px solid ${DRYSTONE.moss}40`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <UserDot user={fedBy} size={20}/>
              <span style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 14, fontStyle: 'italic', color: DRYSTONE.moss,
              }}>Fed by {fedBy.name} · just now</span>
            </div>
          ) : (
            <>
              <button onClick={() => onMarkFed('alex')} style={{
                flex: 1, padding: '10px 12px', borderRadius: 4,
                background: DRYSTONE.ink, color: DRYSTONE.paper, border: 'none',
                fontFamily: '"Inter", system-ui', fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
                cursor: 'pointer',
              }}>Mark fed</button>
              <button style={{
                padding: '10px 12px', borderRadius: 4,
                background: 'transparent', border: `1px solid ${DRYSTONE.stoneDk}40`,
                fontFamily: '"Inter", system-ui', fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: DRYSTONE.inkSoft, cursor: 'pointer',
              }}>Snooze</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Quieter row.
function DrystoneRow({ task, dim }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
      borderBottom: `1px solid ${DRYSTONE.stoneDk}25`, opacity: dim ? 0.55 : 1,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 3, position: 'relative', overflow: 'hidden',
        background: `${task.plant.color}25`, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 14,
          fontStyle: 'italic', color: DRYSTONE.ink,
        }}>{task.plant.initial}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 16,
          color: DRYSTONE.ink, lineHeight: 1.05,
        }}>{task.plant.name}</div>
        <div style={{
          fontFamily: '"Inter", system-ui', fontSize: 10.5, color: DRYSTONE.inkSoft,
          opacity: 0.75, letterSpacing: '0.02em',
        }}>{task.feed}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: '"Inter", system-ui', fontSize: 10,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: DRYSTONE.moss, fontWeight: 600,
        }}>{relWhen(task.date)}</div>
        <div style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic',
          fontSize: 12, color: DRYSTONE.inkSoft, opacity: 0.7,
        }}>{fmtDay(task.date)}</div>
      </div>
    </div>
  );
}

// ── HOME / TODAY ─────────────────────────────────────────────────────────
function DrystoneToday({ stoneIntensity = 1, fedMap = {}, onMarkFed = () => {} }) {
  const todays = getTodayTasks();
  const upcoming = getUpcomingTasks(14);

  return (
    <div style={{
      background: DRYSTONE.bg, minHeight: '100%', paddingBottom: 90,
      fontFamily: 'Inter, system-ui',
    }}>
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0,
        display: 'flex', alignItems: 'center', padding: '0 22px', zIndex: 5,
      }}>
        <div style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic',
          fontSize: 16, color: '#fffdf6', letterSpacing: '0.04em',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>Longstone Stables</div>
        <div style={{ flex: 1 }}/>
        <UserDot user={USERS.alex} size={26} ring/>
        <UserDot user={USERS.jamie} size={26} ring style={{ marginLeft: -8 }}/>
      </div>
      <DrystoneHeader eyebrow="Garden ledger · 10 May" title="Today's feed" stoneIntensity={stoneIntensity}/>

      {/* Tasks */}
      <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {todays.map(t => {
          const key = `${t.plant.id}-${t.schedIndex}`;
          return (
            <DrystoneTaskCard key={key} task={t}
              fed={!!fedMap[key]} fedBy={fedMap[key] ? USERS[fedMap[key]] : null}
              onMarkFed={(u) => onMarkFed(key, u)}/>
          );
        })}
      </div>

      {/* Upcoming */}
      <div style={{ padding: '24px 22px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
        }}>
          <div style={{ flex: 1, height: 1, background: DRYSTONE.stoneDk, opacity: 0.3 }}/>
          <div style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic',
            fontSize: 13, color: DRYSTONE.stoneDk, letterSpacing: '0.1em',
          }}>Coming up</div>
          <div style={{ flex: 1, height: 1, background: DRYSTONE.stoneDk, opacity: 0.3 }}/>
        </div>
        <div>
          {upcoming.slice(0, 4).map((t, i) => (
            <DrystoneRow key={`${t.plant.id}-${i}`} task={t}/>
          ))}
        </div>
      </div>

      <DrystoneTabBar active="today"/>
    </div>
  );
}

// ── CALENDAR ─────────────────────────────────────────────────────────────
function DrystoneCalendar({ stoneIntensity = 1 }) {
  const monthDays = 31;
  const startDow = 5;
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= monthDays; d++) cells.push(d);
  const byDay = {};
  PLANTS.forEach(p => p.schedule.forEach(s => {
    const d = new Date(s.date);
    if (d.getMonth() === 4 && d.getFullYear() === 2026) {
      (byDay[d.getDate()] ||= []).push({ plant: p, ...s });
    }
  }));
  const todayDay = 10;

  return (
    <div style={{
      background: DRYSTONE.bg, minHeight: '100%', paddingBottom: 90,
      fontFamily: 'Inter, system-ui',
    }}>
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0,
        display: 'flex', alignItems: 'center', padding: '0 22px', zIndex: 5,
      }}>
        <div style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic',
          fontSize: 16, color: '#fffdf6', textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>Longstone Stables</div>
        <div style={{ flex: 1 }}/>
        <UserDot user={USERS.alex} size={26} ring/>
        <UserDot user={USERS.jamie} size={26} ring style={{ marginLeft: -8 }}/>
      </div>
      <DrystoneHeader eyebrow="Year ledger · spring" title="May 2026" stoneIntensity={stoneIntensity}/>

      {/* week heads */}
      <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic', fontSize: 12, color: DRYSTONE.stoneDk,
            paddingBottom: 4, borderBottom: `1px solid ${DRYSTONE.stoneDk}40`,
          }}>{d}</div>
        ))}
      </div>
      <div style={{
        padding: '0 18px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
      }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} style={{ aspectRatio: '1', borderBottom: `1px solid ${DRYSTONE.stoneDk}20`, borderRight: i % 7 !== 6 ? `1px solid ${DRYSTONE.stoneDk}20` : 'none' }}/>;
          const tasks = byDay[d] || [];
          const isToday = d === todayDay;
          const hasOverdue = tasks.some(t => t.status === 'overdue');
          return (
            <div key={i} style={{
              aspectRatio: '1', position: 'relative', padding: 4,
              borderBottom: `1px solid ${DRYSTONE.stoneDk}20`,
              borderRight: i % 7 !== 6 ? `1px solid ${DRYSTONE.stoneDk}20` : 'none',
              background: isToday ? DRYSTONE.ink : 'transparent',
            }}>
              <div style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 14, fontWeight: 500,
                color: isToday ? DRYSTONE.paper : (hasOverdue ? DRYSTONE.rust : DRYSTONE.ink),
                lineHeight: 1,
              }}>{d}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, marginTop: 3 }}>
                {tasks.slice(0, 4).map((t, j) => (
                  <span key={j} style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: isToday ? DRYSTONE.paper : t.plant.color,
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
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
        }}>
          <div style={{ flex: 1, height: 1, background: DRYSTONE.stoneDk, opacity: 0.3 }}/>
          <div style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic',
            fontSize: 13, color: DRYSTONE.moss, letterSpacing: '0.08em',
          }}>Sunday 10 May</div>
          <div style={{ flex: 1, height: 1, background: DRYSTONE.stoneDk, opacity: 0.3 }}/>
        </div>
        {(byDay[10] || []).map((t, i) => (
          <DrystoneRow key={i} task={{ ...t, plant: t.plant }}/>
        ))}
      </div>

      <DrystoneTabBar active="calendar"/>
    </div>
  );
}

// Tab bar — flat stone tablet.
function DrystoneTabBar({ active }) {
  const Tab = ({ id, label }) => {
    const on = id === active;
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        padding: '10px 0', position: 'relative',
      }}>
        {on && <div style={{
          position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
          width: 14, height: 2, background: DRYSTONE.moss, borderRadius: 1,
        }}/>}
        <div style={{
          width: 28, height: 28, borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: on ? `${DRYSTONE.moss}15` : 'transparent',
        }}>
          <LeafGlyph size={14} color={on ? DRYSTONE.moss : DRYSTONE.stoneDk}
            tilt={id === 'today' ? -20 : id === 'calendar' ? 10 : 35}/>
        </div>
        <div style={{
          fontFamily: '"Inter", system-ui', fontSize: 9,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: on ? DRYSTONE.moss : DRYSTONE.stoneDk,
          fontWeight: on ? 600 : 500,
        }}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: 16, right: 16,
      borderRadius: 4, background: DRYSTONE.paper,
      border: `1px solid ${DRYSTONE.stoneDk}40`,
      boxShadow: '0 6px 20px rgba(40,30,15,0.12)',
      display: 'flex', overflow: 'hidden',
    }}>
      <Tab id="today" label="Today"/>
      <Tab id="calendar" label="Calendar"/>
      <Tab id="plants" label="Plants"/>
    </div>
  );
}

Object.assign(window, {
  DRYSTONE, DrystoneToday, DrystoneCalendar, DrystoneTabBar,
});
