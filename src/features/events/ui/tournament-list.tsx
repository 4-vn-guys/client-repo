'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Trophy } from 'lucide-react';

import type { Tournament } from '@/entities/tournament';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';

import { useOpenTournaments } from '../model/use-open-tournaments';
import { RegisterTournamentDialog } from './register-tournament-dialog';
import { TournamentCard } from './tournament-card';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function TournamentList({ branchId }: { branchId?: string }) {
  const t = useTranslations('EventsPage');
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const query = useOpenTournaments(branchId);
  const [selected, setSelected] = useState<Tournament | null>(null);

  if (query.isLoading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className='h-[200px] w-full rounded-xl' />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className='border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center rounded-xl border p-8 text-center'>
        <p className='text-destructive mb-4 text-sm font-semibold'>{t('loadError')}</p>
        <Button variant='outline' onClick={() => query.refetch()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  const tournaments = query.data ?? [];
  if (tournaments.length === 0) {
    return (
      <div className='border-border/50 bg-muted/10 animate-in fade-in zoom-in flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center duration-500 lg:p-24'>
        <div className='bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
          <Trophy className='text-primary h-8 w-8' />
        </div>
        <h3 className='mb-2 text-xl font-semibold'>{t('emptyTitle')}</h3>
        <p className='text-muted-foreground mb-6 max-w-sm'>
          {t('tournamentsEmpty')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {tournaments.map(tournament => {
          // Check if current user is registered
          const isRegistered = tournament.registrations?.some(
            reg => reg.captainUserId === user?.id || reg.userId === user?.id
          );
          const registeredCount = tournament.registrations?.length ?? 0;
          const isFull = registeredCount >= tournament.capacity;

          return (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              action={
                isRegistered ? (
                  <Badge
                    variant='outline'
                    className='bg-green-50/50 text-green-700 border-green-200 w-full justify-center py-1.5 font-medium'
                  >
                    {t('registered')}
                  </Badge>
                ) : (
                  <Button
                    className='w-full'
                    disabled={isFull}
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push('/login?returnTo=/events');
                        return;
                      }
                      setSelected(tournament);
                    }}
                  >
                    {isFull ? t('full') : t('register')}
                  </Button>
                )
              }
            />
          );
        })}
      </div>

      <RegisterTournamentDialog
        tournament={selected}
        open={selected !== null}
        onOpenChange={open => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
