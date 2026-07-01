import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registerForTournament } from '@/entities/tournament';

/**
 * Register a team for a tournament. On success the open-tournaments list is
 * refreshed so capacity-driven state stays accurate.
 */
export function useRegisterTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerForTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events', 'tournaments'],
      });
    },
  });
}
