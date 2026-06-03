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
      className={cn(
        'nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-200 cursor-pointer',
        isActive
          ? 'bg-purple-600 text-white shadow-sm'
          : 'text-slate-700 hover:bg-slate-100/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
        isActive && 'active'
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge ? (
        <span
          className='cc-pill text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold'
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
          className='cc-pill text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full shrink-0'
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}
    </Link>
  );

}
