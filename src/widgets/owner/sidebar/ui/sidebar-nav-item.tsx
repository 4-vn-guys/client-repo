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
}

export function SidebarNavItem({
  label,
  href,
  icon: Icon,
  isActive: isActivePath,
  onClick,
}: SidebarNavItemProps) {
  const pathname = usePathname() ?? '';
  const isActive = isActivePath ? isActivePath(pathname) : pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      <Icon className='size-5' />
      <span>{label}</span>
    </Link>
  );
}
