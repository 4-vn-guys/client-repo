'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchBranches } from '@/entities/venue/api';
import { useActiveVenueStore } from './active-venue-store';
import { useAuthStore } from './auth-store';

const VENUE_PATH_RE = /^\/owner\/([^/]+)\/[^/]+/;

const NON_VENUE_OWNER_SEGMENTS = new Set([
  'branches',
  'branding',
  'checkin',
  'members',
  'notifications',
  'performance',
  'pro-shop',
  'reports',
  'schedule',
  'settings',
  'tournaments',
  'yield',
]);

export function useActiveVenue() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const activeVenueId = useActiveVenueStore(s => s.activeVenueId);
  const setActiveVenueId = useActiveVenueStore(s => s.setActiveVenueId);

  const isOwner = !!user && user.role === 'owner';

  const branchesQuery = useQuery({
    queryKey: ['owner-branches'],
    queryFn: fetchBranches,
    enabled: isOwner,
    staleTime: 5 * 60 * 1000,
  });

  const branches = useMemo(
    () => branchesQuery.data ?? [],
    [branchesQuery.data]
  );

  useEffect(() => {
    if (!pathname) return;
    const match = pathname.match(VENUE_PATH_RE);
    if (!match) return;
    const segment = match[1];
    if (NON_VENUE_OWNER_SEGMENTS.has(segment)) return;
    if (segment !== activeVenueId) {
      setActiveVenueId(segment);
    }
  }, [pathname, activeVenueId, setActiveVenueId]);

  useEffect(() => {
    if (!isOwner || !branches.length) return;
    const ids = new Set(branches.map(branch => branch.id));
    if (!activeVenueId || !ids.has(activeVenueId)) {
      setActiveVenueId(branches[0].id);
    }
  }, [isOwner, branches, activeVenueId, setActiveVenueId]);

  const activeVenue = useMemo(
    () => branches.find(branch => branch.id === activeVenueId) ?? null,
    [branches, activeVenueId]
  );

  return {
    activeVenueId,
    activeVenue,
    branches,
    isLoading: branchesQuery.isLoading,
    setActiveVenueId,
  };
}
