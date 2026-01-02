'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { ownerNavItems, ownerBottomNavItems } from '../config';
import { SidebarNavItem } from './sidebar-nav-item';
import { SidebarUser } from './sidebar-user';
import { Separator } from '@/shared/ui/separator';
import { cn } from '@/shared/lib/utils';

export function OwnerSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-card fixed top-3 left-3 z-50 flex items-center justify-center rounded-lg border p-2 shadow-md md:hidden'
        aria-label='Toggle menu'
      >
        {isOpen ? <X className='size-5' /> : <Menu className='size-5' />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-sidebar fixed top-0 left-0 z-40 flex h-screen w-60 flex-col border-r transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className='flex h-14 items-center px-4'>
          <Link href='/owner' className='flex items-center gap-1'>
            <span className='text-primary text-xl font-bold'>Court</span>
            <span className='text-xl font-bold text-emerald-500'>Connect</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-6 overflow-y-auto px-3 py-4'>
          {ownerNavItems.map(section => (
            <div key={section.section}>
              <p className='text-muted-foreground mb-2 px-3 text-xs font-medium tracking-wider uppercase'>
                {section.section}
              </p>
              <div className='space-y-1'>
                {section.items.map(item => (
                  <SidebarNavItem
                    key={item.href}
                    {...item}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className='mt-auto border-t p-3'>
          <div className='space-y-1'>
            {ownerBottomNavItems.map(item => (
              <SidebarNavItem
                key={item.href}
                {...item}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>
          <Separator className='my-3' />
          <SidebarUser name='Owner Jane' venueName='Badminton Pro' />
        </div>
      </aside>
    </>
  );
}
