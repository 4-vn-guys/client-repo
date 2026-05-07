'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store';
import type { UserProfileAction } from './types';

/**
 * Hook for managing user profile actions
 * Handles profile viewing, editing, settings, and logout
 */
export function useUserProfile() {
  const router = useRouter();
  const { clearAuth, user } = useAuthStore();

  const handleAction = useCallback(
    (action: UserProfileAction) => {
      switch (action) {
        case 'view-profile':
          // Open profile view modal
          // TODO: Implement profile view modal
          console.log('View profile');
          break;

        case 'edit-profile':
          // Open profile edit modal
          // TODO: Implement profile edit modal
          console.log('Edit profile');
          break;

        case 'settings':
          // Navigate to settings page
          router.push('/owner/settings');
          break;

        case 'logout':
          // Clear auth state and redirect to login
          clearAuth();
          router.push('/login');
          break;
      }
    },
    [router, clearAuth]
  );

  return {
    user,
    handleAction,
  };
}
