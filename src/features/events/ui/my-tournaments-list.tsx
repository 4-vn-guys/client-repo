'use client';

import { useTranslations } from 'next-intl';
import { CalendarClock, MapPin, Trophy } from 'lucide-react';

import type { TournamentFormat } from '@/entities/tournament';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

import { useMyTournaments } from '../model/use-my-tournaments';

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toLocaleString();
}

export function MyTournamentsList() {
  const t = useTranslations('EventsPage');
  const query = useMyTournaments();

  const formatLabel: Record<TournamentFormat, string> = {
    single_elim: t('formatSingleElim'),
    double_elim: t('formatDoubleElim'),
    round_robin: t('formatRoundRobin'),
  };

  if (query.isLoading) {
    return <p className='text-muted-foreground p-6 text-sm'>{t('loading')}</p>;
  }
  if (query.isError) {
    return <p className='p-6 text-sm text-red-600'>{t('loadError')}</p>;
  }

  const tournaments = query.data ?? [];
  if (tournaments.length === 0) {
    return (
      <p className='text-muted-foreground p-6 text-sm'>
        {t('myTournamentsEmpty')}
      </p>
    );
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {tournaments.map(tournament => {
        const starts = formatDate(tournament.startsAt);
        return (
          <Card key={tournament.id} className='flex flex-col'>
            <CardContent className='flex flex-1 flex-col gap-3 p-5'>
              <div className='flex items-start gap-2'>
                <Trophy className='text-primary mt-0.5 size-4 shrink-0' />
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='truncate font-semibold'>
                      {tournament.name}
                    </span>
                    <Badge variant='secondary' className='capitalize'>
                      {tournament.status}
                    </Badge>
                  </div>
                  {tournament.branch?.name && (
                    <div className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
                      <MapPin className='size-3' />
                      <span className='truncate'>
                        {tournament.branch.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <dl className='text-muted-foreground space-y-1 text-xs'>
                <div className='flex justify-between gap-2'>
                  <dt>{t('format')}</dt>
                  <dd className='text-foreground'>
                    {formatLabel[tournament.format]}
                  </dd>
                </div>
                <div className='flex justify-between gap-2'>
                  <dt>{t('capacity')}</dt>
                  <dd className='text-foreground'>{tournament.capacity}</dd>
                </div>
                <div className='flex justify-between gap-2'>
                  <dt>{t('entryFee')}</dt>
                  <dd className='text-foreground'>
                    {tournament.entryFee > 0
                      ? tournament.entryFee.toLocaleString()
                      : t('free')}
                  </dd>
                </div>
              </dl>

              {starts && (
                <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                  <CalendarClock className='size-3' />
                  <span>{t('starts', { date: starts })}</span>
                </div>
              )}

              <div className='mt-auto pt-2'>
                <Badge variant='outline' className='bg-green-50/50 text-green-700 border-green-200 w-full justify-center py-1.5 font-medium'>
                  {t('registered')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
