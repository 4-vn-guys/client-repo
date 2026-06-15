'use client';

import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

import type { Match } from '@/entities/match';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

import { useLeaveMatch } from '../model/use-leave-match';
import { useMyMatches } from '../model/use-my-matches';
import { MatchCard } from './match-card';

export function MyMatchesList() {
  const t = useTranslations('EventsPage');
  const { user } = useAuth();
  const query = useMyMatches();
  const leaveMutation = useLeaveMatch();

  if (query.isLoading) {
    return <p className='text-muted-foreground p-6 text-sm'>{t('loading')}</p>;
  }
  if (query.isError) {
    return <p className='p-6 text-sm text-red-600'>{t('loadError')}</p>;
  }

  const matches = query.data ?? [];
  if (matches.length === 0) {
    return (
      <p className='text-muted-foreground p-6 text-sm'>{t('myMatchesEmpty')}</p>
    );
  }

  function handleLeave(match: Match) {
    leaveMutation.mutate(match.id, {
      onSuccess: () => toast.success(t('leaveSuccess')),
      onError: (e: Error) => toast.error(e.message || t('loadError')),
    });
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {matches.map(match => {
        const isHost = match.hostUserId === user?.id;
        const isPending =
          leaveMutation.isPending && leaveMutation.variables === match.id;
        return (
          <MatchCard
            key={match.id}
            match={match}
            action={
              isHost ? (
                <Badge variant='outline' className='w-full justify-center py-1'>
                  {t('host')}
                </Badge>
              ) : (
                <Button
                  variant='outline'
                  className='w-full'
                  isLoading={isPending}
                  onClick={() => handleLeave(match)}
                >
                  {t('leave')}
                </Button>
              )
            }
          />
        );
      })}
    </div>
  );
}
