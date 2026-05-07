'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/store';
import { fetchMyFeatureAccess } from '../api/feature-access-api';

export function useFeatureAccess() {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const query = useQuery({
    queryKey: ['feature-access', user?.id],
    queryFn: fetchMyFeatureAccess,
    enabled: isAuthenticated && !!user,
    // RBAC/feature toggles should feel instant; avoid long caching.
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Provide near-real-time updates when admin toggles modules.
    refetchInterval: user?.role === 'owner' ? 10_000 : false,
  });

  const hasFeature = (featureKey?: string) => {
    if (!featureKey) return true;
    if (!user) return false;
    if (user.role === 'admin') return true;
    const enabled = query.data ?? [];
    return enabled.includes(featureKey);
  };

  return {
    enabledFeatures: query.data ?? [],
    hasFeature,
    isLoading: query.isLoading,
    refresh: query.refetch,
  };
}
