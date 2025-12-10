'use client';

import Link from 'next/link';

import { ownerNavItems, ownerBottomNavItems } from '../config';
import { SidebarNavItem } from './sidebar-nav-item';
import { SidebarUser } from './sidebar-user';
import { Separator } from '@/shared/ui/separator';

export function OwnerSidebar() {
  return (
    <aside className='bg-sidebar fixed top-0 left-0 z-40 flex h-screen w-60 flex-col border-r'>
      {/* Logo */}
      <div className='flex h-14 items-center px-4'>
        <Link href='/owner' className='flex items-center gap-1'>
          <span className='text-primary text-xl font-bold'>Court</span>
          <span className='text-xl font-bold text-emerald-500'>Connect</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-6 px-3 py-4'>
        {ownerNavItems.map(section => (
          <div key={section.section}>
            <p className='text-muted-foreground mb-2 px-3 text-xs font-medium tracking-wider uppercase'>
              {section.section}
            </p>
            <div className='space-y-1'>
              {section.items.map(item => (
                <SidebarNavItem key={item.href} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className='mt-auto border-t p-3'>
        <div className='space-y-1'>
          {ownerBottomNavItems.map(item => (
            <SidebarNavItem key={item.href} {...item} />
          ))}
        </div>
        <Separator className='my-3' />
        <SidebarUser name='Owner Jane' venueName='Badminton Pro' />
      </div>
    </aside>
  );
}
