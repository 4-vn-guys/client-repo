import { useQuery } from '@tanstack/react-query';

import { fetchMyTournaments } from '@/entities/tournament';
import { eventsQueryKeys } from './query-keys';

/**
 * Tournaments the current player has registered for.
 */
export function useMyTournaments() {
  return useQuery({
    queryKey: eventsQueryKeys.myTournaments(),
    queryFn: fetchMyTournaments,
  });
}
