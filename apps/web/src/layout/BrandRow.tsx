import { UserDot } from '../components/botanical/UserDot';
import { useUsers } from '../hooks/useUsers';
import { useIdentity } from '../hooks/useIdentity';
import { VERDURE } from '../theme/tokens';

export function BrandRow() {
  const { data: users } = useUsers();
  const me = useIdentity();
  const alexa = users?.find((u) => u.slug === 'alexa');
  const stevie = users?.find((u) => u.slug === 'stevie');

  const renderDot = (
    user: { initial: string; tone: string; slug: string } | undefined,
    isLast: boolean,
  ) => {
    if (!user) return null;
    const ring = user.slug === me;
    return (
      <UserDot
        user={user}
        size={26}
        ring={ring}
        style={isLast ? { marginLeft: -8 } : undefined}
      />
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 22px 0',
      }}
    >
      <div
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontStyle: 'italic',
          fontSize: 18,
          color: VERDURE.moss,
          letterSpacing: '-0.01em',
        }}
      >
        Longstone Garden
      </div>
      <div style={{ flex: 1 }} />
      {renderDot(alexa, false)}
      {renderDot(stevie, true)}
    </div>
  );
}
