'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { ownerNavItems, ownerBottomNavItems } from '../config';
import type { OwnerNavItem } from '../config';
import { SidebarNavItem } from './sidebar-nav-item';
import { UserProfileButton } from '@/features/user-profile';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/shared/store';
import { useTranslations } from 'next-intl';
import { useNotifications } from '@/features/notifications';
import { useFeatureAccess } from '@/features/authorization/model/use-feature-access';
import { useStaffAccess } from '@/features/authorization/model/use-staff-access';
import { VenueSwitcher, useActiveVenue } from '@/widgets/owner/venue-switcher';

export function OwnerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const tSidebar = useTranslations('OwnerSidebar');
  const { unreadCount } = useNotifications();
  const { hasFeature } = useFeatureAccess();
  const { permissionSet } = useStaffAccess();
  const { activeVenueId } = useActiveVenue();

  // Branch staff (account role 'user') get a permission-filtered menu;
  // owners/admins keep the full menu with module (featureKey) gates.
  const isStaffViewer = user?.role === 'user';
  const canSee = (item: OwnerNavItem): boolean => {
    if (!isStaffViewer) return hasFeature(item.featureKey);
    if (item.ownerOnly) return false;
    if (item.staffPermission && !permissionSet.has(item.staffPermission)) {
      return false;
    }
    return true;
  };

  const resolveHref = (labelKey: string, defaultHref: string): string => {
    if (labelKey === 'schedule') {
      return activeVenueId
        ? `/owner/${activeVenueId}/timeline`
        : '/owner/branches?picker=schedule';
    }
    if (labelKey === 'proShop' && activeVenueId) {
      // Skip the branch-picker page when we already know the active venue.
      return `/owner/${activeVenueId}/pro-shop`;
    }
    return defaultHref;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-card fixed top-3 left-3 z-50 flex items-center justify-center rounded-lg border p-2 shadow-md md:hidden'
        aria-label={tSidebar('toggleMenu')}
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
          href='/owner'
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
        </Link>

        <VenueSwitcher />

        {ownerNavItems.map(section => {
          const visibleItems = section.items.filter(canSee);
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.sectionKey}>
              <div className='nav-label'>{tSidebar(section.sectionKey)}</div>
              {visibleItems.map(item => (
                <SidebarNavItem
                  key={item.labelKey}
                  href={resolveHref(item.labelKey, item.href)}
                  icon={item.icon}
                  isActive={item.isActive}
                  label={tSidebar(item.labelKey)}
                  badge={item.badgeKey ? tSidebar(item.badgeKey) : undefined}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          );
        })}

        <div style={{ flex: 1 }} />

        <div
          style={{
            borderTop: '1px solid var(--cc-line-2)',
            paddingTop: 10,
            marginTop: 8,
          }}
        >
          {ownerBottomNavItems.filter(canSee).map(item => (
            <SidebarNavItem
              key={item.href}
              {...item}
              label={tSidebar(item.labelKey)}
              badgeCount={
                item.href === '/owner/notifications' ? unreadCount : undefined
              }
              onClick={() => setIsOpen(false)}
            />
          ))}
          <div style={{ marginTop: 10 }}>
            <UserProfileButton
              name={user?.username || tSidebar('defaultUser')}
              role={user?.role || tSidebar('defaultOwner')}
              email={user?.email}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
