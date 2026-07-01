'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarClock, MapPin, Trophy } from 'lucide-react';

import type { Tournament, TournamentFormat } from '@/entities/tournament';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toLocaleString();
}

export function TournamentCard({
  tournament,
  action,
}: {
  tournament: Tournament;
  action?: ReactNode;
}) {
  const t = useTranslations('EventsPage');
  const starts = formatDate(tournament.startsAt);

  const formatLabel: Record<TournamentFormat, string> = {
    single_elim: t('formatSingleElim'),
    double_elim: t('formatDoubleElim'),
    round_robin: t('formatRoundRobin'),
  };

  const registeredCount = tournament.registrations?.length ?? 0;
  const isFull = registeredCount >= tournament.capacity;

  return (
    <Card className='flex flex-col'>
      <CardContent className='flex flex-1 flex-col gap-3 p-5'>
        <div className='flex items-start gap-2'>
          <Trophy className='text-primary mt-0.5 size-4 shrink-0' />
          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='truncate font-semibold'>
                {tournament.name}
              </span>
              {tournament.status === 'live' ? (
                <Badge variant='destructive' className='text-[10px] uppercase font-bold tracking-wider bg-red-600 text-white hover:bg-red-600'>
                  {t('statusLive', { defaultValue: 'Live' })}
                </Badge>
              ) : (
                <Badge variant='secondary' className='capitalize text-[10px]'>
                  {tournament.status}
                </Badge>
              )}
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
            <dd className='text-foreground'>
              {isFull ? (
                <span className='text-destructive font-medium'>{t('full')}</span>
              ) : (
                `${registeredCount} / ${tournament.capacity}`
              )}
            </dd>
          </div>
          <div className='flex justify-between gap-2'>
            <dt>{t('entryFee')}</dt>
            <dd className='text-foreground font-semibold text-primary-600'>
              {tournament.entryFee > 0
                ? `${tournament.entryFee.toLocaleString()} VND`
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

        {action && <div className='mt-auto pt-2'>{action}</div>}
      </CardContent>
    </Card>
  );
}
