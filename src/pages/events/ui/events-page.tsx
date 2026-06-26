'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { MatchList, MyMatchesList, TournamentList, MyTournamentsList } from '@/features/events';
import { useAuth } from '@/features/auth/hooks/use-auth';

type EventsTab = 'tournaments' | 'matches' | 'schedule';

export function EventsPage() {
  const t = useTranslations('EventsPage');
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<EventsTab>('tournaments');

  const tabs: { key: EventsTab; label: string }[] = [
    { key: 'tournaments' as const, label: t('tabsTournaments') },
    { key: 'matches' as const, label: t('tabsMatches') },
    ...(isAuthenticated ? [{ key: 'schedule' as const, label: t('tabsMySchedule') }] : []),
  ];

  return (
    <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
      </div>

      <div className='mb-6 inline-flex gap-1 rounded-lg border p-1'>
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type='button'
            onClick={() => setTab(key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'tournaments' && (
        <TournamentList />
      )}

      {tab === 'matches' && (
        <section>
          <h2 className='mb-4 text-lg font-semibold'>
            {t('matchesOpenTitle')}
          </h2>
          <MatchList />
        </section>
      )}

      {tab === 'schedule' && isAuthenticated && (
        <div className='space-y-10'>
          <section>
            <h2 className='mb-4 text-lg font-semibold'>
              {t('myTournamentsTitle')}
            </h2>
            <MyTournamentsList />
          </section>
          <section>
            <h2 className='mb-4 text-lg font-semibold'>
              {t('myMatchesTitle')}
            </h2>
            <MyMatchesList />
          </section>
        </div>
      )}
    </div>
  );
}
