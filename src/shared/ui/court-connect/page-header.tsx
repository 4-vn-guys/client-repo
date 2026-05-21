'use client';

import type { ReactNode } from 'react';
import { CCIcons } from './icons';

export function OwnerPageHeader({
  title,
  breadcrumb,
  actions,
}: {
  title: string;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid var(--cc-line)',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 13,
          color: 'var(--cc-ink-3)',
        }}
      >
        {breadcrumb ?? (
          <>
            <span style={{ color: 'var(--cc-mute)' }}>Owner workspace</span>
            <span>›</span>
            <span style={{ color: 'var(--cc-ink)', fontWeight: 600 }}>
              {title}
            </span>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className='cc-btn'>
          <CCIcons.search size={14} /> Search
        </button>
        <button
          className='cc-btn cc-btn-ghost'
          style={{ position: 'relative' }}
          aria-label='Notifications'
        >
          <CCIcons.bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--cc-red)',
            }}
          />
        </button>
        {actions}
      </div>
    </div>
  );
}

export function OwnerPageBody({ children }: { children: ReactNode }) {
  return <div style={{ padding: '24px 28px' }}>{children}</div>;
}
