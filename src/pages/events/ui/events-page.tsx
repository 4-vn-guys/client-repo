'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

import { MatchList, MyMatchesList, TournamentList, MyTournamentsList } from '@/features/events';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { fetchPublicBranches } from '@/entities/venue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import type { MatchLevel } from '@/entities/match';

type EventsTab = 'tournaments' | 'matches' | 'schedule';

export function EventsPage() {
  const t = useTranslations('EventsPage');
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<EventsTab>('tournaments');

  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const { data: branches = [] } = useQuery({
    queryKey: ['public-branches'],
    queryFn: () => fetchPublicBranches({ perPage: 100 }),
  });

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

      {/* Filters Bar */}
      {(tab === 'tournaments' || tab === 'matches') && (
        <div className='border-border/60 bg-muted/20 mb-6 flex flex-wrap items-end gap-4 rounded-xl border p-4'>
          <div className='flex min-w-[200px] flex-col gap-1.5'>
            <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
              {t('filterBranch')}
            </label>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
              <SelectTrigger className='bg-background w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('allBranches')}</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {tab === 'matches' && (
            <div className='flex min-w-[160px] flex-col gap-1.5'>
              <label className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
                {t('filterLevel')}
              </label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className='bg-background w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>{t('allLevels')}</SelectItem>
                  <SelectItem value='beginner'>{t('levelBeginner')}</SelectItem>
                  <SelectItem value='intermediate'>{t('levelIntermediate')}</SelectItem>
                  <SelectItem value='pro'>{t('levelPro')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {tab === 'tournaments' && (
        <TournamentList branchId={selectedBranchId === 'all' ? undefined : selectedBranchId} />
      )}

      {tab === 'matches' && (
        <section>
          <h2 className='mb-4 text-lg font-semibold'>
            {t('matchesOpenTitle')}
          </h2>
          <MatchList
            filters={{
              branchId: selectedBranchId === 'all' ? undefined : selectedBranchId,
              level: selectedLevel === 'all' ? undefined : (selectedLevel as MatchLevel),
            }}
          />
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
