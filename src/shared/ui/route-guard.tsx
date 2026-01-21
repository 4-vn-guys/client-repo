'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';

/**
 * Route Guard Component
 * Protects pages that require authentication
 *
 * Usage:
 * ```tsx
 * export default function ProtectedPage() {
 *   return (
 *     <RouteGuard>
 *       <YourPageContent />
 *     </RouteGuard>
 *   );
 * }
 * ```
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
          <p className='text-muted-foreground mt-2'>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
