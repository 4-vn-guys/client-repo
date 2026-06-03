'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { adminNavItems } from '../config';
import { SidebarNavItem } from '@/widgets/owner/sidebar/ui/sidebar-nav-item';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';

import { useAuthStore } from '@/shared/store';
import { UserProfileButton } from '@/features/user-profile';

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  ownerGroups: 'Owner Groups',
  tiers: 'Tier Presets',
  revenue: 'Revenue',
  overview: 'Overview',
  modules: 'Modules',
  'RBAC matrix': 'RBAC Matrix',
  'audit logs': 'Audit Logs',
  billing: 'Billing',
  concurrency: 'Concurrency',
  'data sheets': 'Data Sheets',
};

const sectionMap: Record<string, string> = {
  admin: 'Admin Console',
  platform: 'Platform Operations',
};

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-card fixed top-3 left-3 z-50 flex items-center justify-center rounded-lg border p-2 shadow-md md:hidden'
        aria-label='Toggle menu'
      >
        {isOpen ? <X className='size-5' /> : <Menu className='size-5' />}
      </button>

      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          'cc-sidebar fixed top-0 left-0 z-40 h-screen transition-transform duration-300 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Link
          href='/admin'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 10px 8px',
            textDecoration: 'none',
          }}
        >
          <span className='cc-wordmark' style={{ fontSize: 18 }}>
            <span className='court'>Court</span>{' '}
            <span className='connect'>Connect</span>
          </span>
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 uppercase tracking-widest font-extrabold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-none rounded">
            Admin
          </Badge>
        </Link>

        {adminNavItems.map(section => (
          <div key={section.sectionKey}>
            <div className='nav-label'>
              {sectionMap[section.sectionKey] || section.sectionKey}
            </div>
            {section.items.map(item => (
              <SidebarNavItem
                key={item.labelKey}
                href={item.href}
                icon={item.icon}
                label={labelMap[item.labelKey] || item.labelKey}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>
        ))}

        <div style={{ flex: 1 }} />

        <div
          style={{
            borderTop: '1px solid var(--cc-line-2)',
            paddingTop: 10,
            marginTop: 8,
          }}
        >
          <UserProfileButton
            name={user?.username || 'Admin'}
            role={user?.role || 'admin'}
            email={user?.email}
          />
        </div>
      </aside>
    </>
  );
}
