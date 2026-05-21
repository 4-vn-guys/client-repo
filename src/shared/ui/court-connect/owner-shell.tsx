'use client';

import type { ReactNode } from 'react';
import { CCSidebar, type CCNavSection } from './sidebar';
import { CCTopBar } from './primitives';
import { CCIcons } from './icons';

export const ownerNav: CCNavSection[] = [
  {
    label: 'MANAGEMENT',
    items: [
      {
        label: 'Branches',
        href: '/owner/branches',
        icon: <CCIcons.pin size={16} />,
      },
      {
        label: 'Schedule',
        href: '/owner/schedule',
        icon: <CCIcons.cal size={16} />,
      },
      {
        label: 'Yield · Pricing',
        href: '/owner/yield',
        icon: <CCIcons.bolt size={16} />,
        badge: 'AI',
      },
      {
        label: 'Tournaments',
        href: '/owner/tournaments',
        icon: <CCIcons.trophy size={16} />,
      },
      {
        label: 'Members',
        href: '/owner/members',
        icon: <CCIcons.users size={16} />,
      },
      {
        label: 'Pro Shop',
        href: '/owner/pro-shop',
        icon: <CCIcons.box size={16} />,
      },
      {
        label: 'Check-in',
        href: '/owner/checkin',
        icon: <CCIcons.qr size={16} />,
      },
      {
        label: 'Reports',
        href: '/owner/reports',
        icon: <CCIcons.chart size={16} />,
      },
      {
        label: 'Branding',
        href: '/owner/branding',
        icon: <CCIcons.spark size={16} />,
      },
      {
        label: 'Notifications',
        href: '/owner/notifications',
        icon: <CCIcons.mail size={16} />,
      },
      {
        label: 'Settings',
        href: '/owner/settings',
        icon: <CCIcons.cog size={16} />,
      },
    ],
  },
];

export function OwnerShell({
  title,
  breadcrumb,
  actions,
  user,
  children,
}: {
  title: string;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  user?: {
    initials: string;
    name: string;
    role: string;
    tone?: 'green' | 'purple' | 'amber' | 'blue';
  };
  children: ReactNode;
}) {
  return (
    <div
      className='cc'
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--cc-bg-2)',
      }}
    >
      <CCSidebar sections={ownerNav} user={user} role='MANAGEMENT' />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <CCTopBar
          left={
            breadcrumb ?? (
              <>
                <span style={{ color: 'var(--cc-mute)' }}>Owner workspace</span>
                <span>›</span>
                <span style={{ color: 'var(--cc-ink)', fontWeight: 600 }}>
                  {title}
                </span>
              </>
            )
          }
          right={
            <>
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
            </>
          }
        />
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
