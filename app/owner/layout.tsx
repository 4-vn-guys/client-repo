import type React from 'react';
import { OwnerSidebar } from '@/widgets/owner/sidebar';
import { OwnerRouteGuard } from '@/features/authorization/ui/owner-route-guard';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OwnerRouteGuard>
      <div
        className='cc'
        style={{ minHeight: '100vh', background: 'var(--cc-bg-2)' }}
      >
        <OwnerSidebar />
        <main className='min-h-screen md:ml-[232px]'>{children}</main>
      </div>
    </OwnerRouteGuard>
  );
}
