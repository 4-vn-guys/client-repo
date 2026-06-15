import { useQuery } from '@tanstack/react-query';

import { fetchMyMatches } from '@/entities/match';
import { eventsQueryKeys } from './query-keys';

/**
 * Matches the current player has hosted or joined.
 */
export function useMyMatches() {
  return useQuery({
    queryKey: eventsQueryKeys.myMatches(),
    queryFn: fetchMyMatches,
  });
}
