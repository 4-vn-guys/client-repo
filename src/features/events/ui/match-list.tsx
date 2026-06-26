'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

import type { Match } from '@/entities/match';
import { Button } from '@/shared/ui/button';

import { useJoinMatch } from '../model/use-join-match';
import { useOpenMatches } from '../model/use-open-matches';
import { MatchCard } from './match-card';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function MatchList() {
  const t = useTranslations('EventsPage');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const query = useOpenMatches();
  const joinMutation = useJoinMatch();

  if (query.isLoading) {
    return <p className='text-muted-foreground p-6 text-sm'>{t('loading')}</p>;
  }
  if (query.isError) {
    return <p className='p-6 text-sm text-red-600'>{t('loadError')}</p>;
  }

  const matches = query.data ?? [];
  if (matches.length === 0) {
    return (
      <p className='text-muted-foreground p-6 text-sm'>{t('matchesEmpty')}</p>
    );
  }

  function handleJoin(match: Match) {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/events');
      return;
    }
    joinMutation.mutate(match.id, {
      onSuccess: () => toast.success(t('joinSuccess')),
      onError: (e: Error) => toast.error(e.message || t('loadError')),
    });
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {matches.map(match => {
        const isFull = match.spotsOpen <= 0 || match.status === 'full';
        const isPending =
          joinMutation.isPending && joinMutation.variables === match.id;
        return (
          <MatchCard
            key={match.id}
            match={match}
            action={
              <Button
                className='w-full'
                disabled={isFull}
                isLoading={isPending}
                onClick={() => handleJoin(match)}
              >
                {isFull ? t('full') : t('join')}
              </Button>
            }
          />
        );
      })}
    </div>
  );
}
