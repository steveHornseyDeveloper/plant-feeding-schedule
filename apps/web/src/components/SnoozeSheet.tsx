import { useEffect } from 'react';
import { VERDURE } from '../theme/tokens';

type Props = {
  open: boolean;
  onClose: () => void;
  onSnooze: (days: 1 | 3 | 7) => void;
};

const OPTIONS: Array<{ days: 1 | 3 | 7; label: string; sub: string }> = [
  { days: 1, label: '+1 day',  sub: 'tomorrow' },
  { days: 3, label: '+3 days', sub: 'a little later' },
  { days: 7, label: '+7 days', sub: 'next week' },
];

export function SnoozeSheet({ open, onClose, onSnooze }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(31,46,35,0.35)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: VERDURE.card,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          padding: '18px 18px 28px',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 -10px 40px rgba(63,107,74,0.18)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: VERDURE.cardEdge,
            margin: '0 auto 14px',
          }}
        />
        <div
          style={{
            fontFamily: 'Sora, system-ui',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: VERDURE.moss,
            opacity: 0.8,
            marginBottom: 10,
          }}
        >
          Snooze for
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.days}
              onClick={() => onSnooze(opt.days)}
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: 14,
                background: VERDURE.bgDeep,
                border: `1px solid ${VERDURE.cardEdge}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: '"DM Serif Display", Georgia, serif',
                  fontSize: 18,
                  color: VERDURE.ink,
                }}
              >
                {opt.label}
              </span>
              <span
                style={{
                  fontFamily: 'Sora, system-ui',
                  fontSize: 12,
                  color: VERDURE.inkSoft,
                  opacity: 0.7,
                }}
              >
                {opt.sub}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '10px 12px',
            background: 'transparent',
            border: 'none',
            color: VERDURE.inkSoft,
            fontFamily: 'Sora, system-ui',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
