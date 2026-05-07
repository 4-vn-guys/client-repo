'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { adminNavItems } from '../config';
import { SidebarNavItem } from '@/widgets/owner/sidebar/ui/sidebar-nav-item';
import { Separator } from '@/shared/ui/separator';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/shared/store';
import { UserProfileButton } from '@/features/user-profile';

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
          'bg-sidebar fixed top-0 left-0 z-40 flex h-screen w-60 flex-col border-r transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='flex h-14 items-center px-4'>
          <Link href='/admin' className='flex items-center gap-1'>
            <span className='text-primary text-xl font-bold'>Court</span>
            <span className='text-xl font-bold text-emerald-500'>Connect</span>
            <span className='text-muted-foreground ml-2 text-xs font-medium uppercase'>
              Admin
            </span>
          </Link>
        </div>

        <nav className='flex-1 space-y-6 overflow-y-auto px-3 py-4'>
          {adminNavItems.map(section => (
            <div key={section.sectionKey}>
              <p className='text-muted-foreground mb-2 px-3 text-xs font-medium tracking-wider uppercase'>
                {section.sectionKey}
              </p>
              <div className='space-y-1'>
                {section.items.map(item => (
                  <SidebarNavItem
                    key={item.labelKey}
                    href={item.href}
                    icon={item.icon}
                    label={item.labelKey}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className='mt-auto border-t p-3'>
          <Separator className='my-3' />
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
