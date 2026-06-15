import { useMutation, useQueryClient } from '@tanstack/react-query';

import { leaveMatch } from '@/entities/match';

/**
 * Leave a joined match, then refresh both the open lobby and "my matches".
 */
export function useLeaveMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => leaveMatch(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'matches'] });
    },
  });
}
