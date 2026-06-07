import type { ReactNode } from 'react';
import { TabBar } from './TabBar';
import { VERDURE } from '../theme/tokens';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: VERDURE.bg,
        minHeight: '100dvh',
        fontFamily: 'Sora, system-ui',
        paddingBottom: 100,
        position: 'relative',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <div style={{ height: 24 }} />
      {children}
      <TabBar />
    </div>
  );
}
