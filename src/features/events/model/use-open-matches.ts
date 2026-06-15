import { useQuery } from '@tanstack/react-query';

import { fetchOpenMatches, type MatchListFilters } from '@/entities/match';
import { eventsQueryKeys } from './query-keys';

/**
 * Open, upcoming pickup matches players can join.
 */
export function useOpenMatches(filters?: MatchListFilters) {
  return useQuery({
    queryKey: eventsQueryKeys.openMatches(filters),
    queryFn: () => fetchOpenMatches(filters),
  });
}
