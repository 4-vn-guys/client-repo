'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive?: (pathname: string) => boolean;
  onClick?: () => void;
  badgeCount?: number;
}

export function SidebarNavItem({
  label,
  href,
  icon: Icon,
  isActive: isActivePath,
  onClick,
  badgeCount,
}: SidebarNavItemProps) {
  const pathname = usePathname() ?? '';
  const isActive = isActivePath ? isActivePath(pathname) : pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:ring-3 focus-visible:ring-violet-500/30 focus-visible:outline-none',
        isActive
          ? 'bg-primary text-primary-foreground shadow-lg shadow-violet-500/20'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-0.5'
      )}
    >
      {isActive && (
        <span className='absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/90' />
      )}
      <Icon className='size-5 transition-transform duration-200 group-hover:scale-105' />
      <span>{label}</span>
      {badgeCount && badgeCount > 0 ? (
        <span className='ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white'>
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}
    </Link>
  );
}
