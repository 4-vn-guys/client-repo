'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CCPill } from './primitives';
import { cn } from '@/shared/lib/utils';

export type CCNavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
  match?: (pathname: string) => boolean;
};

export type CCNavSection = {
  label?: string;
  items: CCNavItem[];
};

export function CCSidebar({
  sections,
  brandSub,
  role = 'MANAGEMENT',
  user,
  footer,
}: {
  sections: CCNavSection[];
  brandSub?: string;
  role?: string;
  user?: {
    initials: string;
    name: string;
    role: string;
    tone?: 'green' | 'purple' | 'amber' | 'blue';
  };
  footer?: ReactNode;
}) {
  const pathname = usePathname() ?? '';

  return (
    <aside className='cc-sidebar sticky top-0 h-screen'>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 10px 8px',
        }}
      >
        <span className='cc-wordmark' style={{ fontSize: 18 }}>
          <span className='court'>Court</span>{' '}
          <span className='connect'>Connect</span>
        </span>
        {brandSub && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--cc-mute)',
              letterSpacing: '0.16em',
              marginLeft: 4,
            }}
          >
            {brandSub}
          </span>
        )}
      </div>

      {sections.map((section, si) => (
        <div key={si}>
          <div className='nav-label'>
            {section.label ?? (si === 0 ? role : '')}
          </div>
          {section.items.map(item => {
            const active = item.match
              ? item.match(pathname)
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn('nav-item', active && 'active')}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <CCPill
                    style={
                      active
                        ? { background: 'rgba(255,255,255,.2)', color: '#fff' }
                        : undefined
                    }
                  >
                    {item.badge}
                  </CCPill>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      <div style={{ flex: 1 }} />
      {footer}
      {user && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 10px',
            borderTop: '1px solid var(--cc-line-2)',
            marginTop: 8,
          }}
        >
          <span className={cn('cc-avatar', 'lg', user.tone)}>
            {user.initials}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--cc-mute)' }}>
              {user.role}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
