'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

import type { Match } from '@/entities/match';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

import { useLeaveMatch } from '../model/use-leave-match';
import { useMyMatches } from '../model/use-my-matches';
import { MatchCard } from './match-card';

export function MyMatchesList() {
  const t = useTranslations('EventsPage');
  const { user } = useAuth();
  const query = useMyMatches();
  const leaveMutation = useLeaveMatch();
  const [matchToLeave, setMatchToLeave] = useState<Match | null>(null);

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

  function handleLeaveConfirm() {
    if (!matchToLeave) return;
    leaveMutation.mutate(matchToLeave.id, {
      onSuccess: () => {
        toast.success(t('leaveSuccess'));
        setMatchToLeave(null);
      },
      onError: (e: Error) => {
        toast.error(e.message || t('loadError'));
      },
    });
  }

  return (
    <>
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
                    onClick={() => setMatchToLeave(match)}
                  >
                    {t('leave')}
                  </Button>
                )
              }
            />
          );
        })}
      </div>

      <Dialog
        open={matchToLeave !== null}
        onOpenChange={open => {
          if (!open) setMatchToLeave(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('leaveMatchConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('leaveMatchConfirmDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              variant='outline'
              onClick={() => setMatchToLeave(null)}
              disabled={leaveMutation.isPending}
            >
              {t('cancel')}
            </Button>
            <Button
              variant='solid'
              colorPattern='red'
              onClick={handleLeaveConfirm}
              isLoading={leaveMutation.isPending}
            >
              {t('leaveMatchConfirmCta')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
