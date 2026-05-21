'use client';

import type { ComponentType, SVGProps } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/utils';

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive?: (pathname: string) => boolean;
  onClick?: () => void;
  badgeCount?: number;
  badge?: string;
}

export function SidebarNavItem({
  label,
  href,
  icon: Icon,
  isActive: isActivePath,
  onClick,
  badgeCount,
  badge,
}: SidebarNavItemProps) {
  const pathname = usePathname() ?? '';
  const isActive = isActivePath
    ? isActivePath(pathname)
    : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('nav-item', isActive && 'active')}
    >
      <Icon width={16} height={16} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? (
        <span
          className='cc-pill'
          style={
            isActive
              ? { background: 'rgba(255,255,255,.2)', color: '#fff' }
              : undefined
          }
        >
          {badge}
        </span>
      ) : null}
      {badgeCount && badgeCount > 0 ? (
        <span
          className='cc-pill'
          style={{
            background: 'var(--cc-red)',
            color: '#fff',
            padding: '2px 7px',
          }}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}
    </Link>
  );
}
