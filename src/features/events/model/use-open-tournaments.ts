import { useQuery } from '@tanstack/react-query';

import { fetchOpenTournaments } from '@/entities/tournament';
import { eventsQueryKeys } from './query-keys';

/**
 * Open/live tournaments players can register for.
 */
export function useOpenTournaments(branchId?: string) {
  return useQuery({
    queryKey: eventsQueryKeys.openTournaments(branchId),
    queryFn: () => fetchOpenTournaments(branchId),
  });
}
