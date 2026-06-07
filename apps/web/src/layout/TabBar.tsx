import { NavLink } from 'react-router-dom';
import { LeafGlyph } from '../components/botanical/LeafGlyph';
import { VERDURE } from '../theme/tokens';

type TabId = 'today' | 'calendar' | 'plants';

type TabSpec = { id: TabId; label: string; to: string; tilt: number };

const TABS: TabSpec[] = [
  { id: 'today',    label: 'Today',    to: '/',         tilt: -20 },
  { id: 'calendar', label: 'Calendar', to: '/calendar', tilt: 10 },
  { id: 'plants',   label: 'Plants',   to: '/plants',   tilt: 35 },
];

export function TabBar() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 480,
        margin: '0 auto',
        borderRadius: 22,
        background: 'rgba(255,253,248,0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${VERDURE.cardEdge}`,
        boxShadow: '0 10px 30px rgba(63,107,74,0.12)',
        display: 'flex',
        padding: '2px 6px',
        zIndex: 10,
      }}
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.to}
          end={tab.to === '/'}
          style={{ flex: 1, textDecoration: 'none' }}
        >
          {({ isActive }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '8px 0',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: isActive ? VERDURE.moss : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LeafGlyph
                  size={16}
                  color={isActive ? '#fffdf8' : VERDURE.moss}
                  tilt={tab.tilt}
                />
              </div>
              <div
                style={{
                  fontFamily: 'Sora, system-ui',
                  fontSize: 10,
                  color: isActive ? VERDURE.moss : VERDURE.inkSoft,
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.04em',
                }}
              >
                {tab.label}
              </div>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
}
