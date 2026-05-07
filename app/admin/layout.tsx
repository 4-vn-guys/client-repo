import type React from 'react';
import { AdminRouteGuard } from '@/features/authorization/ui/admin-route-guard';
import { AdminSidebar } from '@/widgets/admin/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRouteGuard>
      <div className='bg-background min-h-screen'>
        <AdminSidebar />
        <main className='min-h-screen md:ml-60'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}
