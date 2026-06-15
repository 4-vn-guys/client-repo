import type { MatchListFilters } from '@/entities/match';

/**
 * Centralised TanStack Query keys for the player events lobby so that
 * mutations can invalidate the exact lists they affect.
 */
export const eventsQueryKeys = {
  openTournaments: (branchId?: string) =>
    ['events', 'tournaments', 'open', branchId ?? null] as const,
  openMatches: (filters?: MatchListFilters) =>
    [
      'events',
      'matches',
      'open',
      filters?.branchId ?? null,
      filters?.level ?? null,
    ] as const,
  myMatches: () => ['events', 'matches', 'me'] as const,
};
