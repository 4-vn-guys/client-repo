import { useMutation, useQueryClient } from '@tanstack/react-query';

import { joinMatch } from '@/entities/match';

/**
 * Join an open match, then refresh both the open lobby and "my matches".
 */
export function useJoinMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => joinMatch(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'matches'] });
    },
  });
}
