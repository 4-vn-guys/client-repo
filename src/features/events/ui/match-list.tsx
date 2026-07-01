'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Users } from 'lucide-react';

import type { Match, MatchListFilters } from '@/entities/match';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

import { useJoinMatch } from '../model/use-join-match';
import { useLeaveMatch } from '../model/use-leave-match';
import { useOpenMatches } from '../model/use-open-matches';
import { MatchCard } from './match-card';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function MatchList({ filters }: { filters?: MatchListFilters }) {
  const t = useTranslations('EventsPage');
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const query = useOpenMatches(filters);
  const joinMutation = useJoinMatch();
  const leaveMutation = useLeaveMatch();
  const [matchToLeave, setMatchToLeave] = useState<Match | null>(null);

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

  const matches = query.data ?? [];
  if (matches.length === 0) {
    return (
      <div className='border-border/50 bg-muted/10 animate-in fade-in zoom-in flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center duration-500 lg:p-24'>
        <div className='bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
          <Users className='text-primary h-8 w-8' />
        </div>
        <h3 className='mb-2 text-xl font-semibold'>{t('emptyTitle')}</h3>
        <p className='text-muted-foreground mb-6 max-w-sm'>
          {t('matchesEmpty')}
        </p>
      </div>
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
          const isParticipant = match.participants?.some(
            p => p.userId === user?.id
          );
          const isFull = match.spotsOpen <= 0 || match.status === 'full';

          // Pending states
          const isJoinPending =
            joinMutation.isPending && joinMutation.variables === match.id;
          const isLeavePending =
            leaveMutation.isPending && leaveMutation.variables === match.id;

          // Render appropriate action element
          let actionElement;
          if (isHost) {
            actionElement = (
              <Badge variant='outline' className='w-full justify-center py-1.5 font-medium'>
                {t('host')}
              </Badge>
            );
          } else if (isParticipant) {
            actionElement = (
              <Button
                variant='outline'
                className='w-full'
                isLoading={isLeavePending}
                onClick={() => setMatchToLeave(match)}
              >
                {t('leave')}
              </Button>
            );
          } else {
            actionElement = (
              <Button
                className='w-full'
                disabled={isFull}
                isLoading={isJoinPending}
                onClick={() => handleJoin(match)}
              >
                {isFull ? t('full') : t('join')}
              </Button>
            );
          }

          return (
            <MatchCard
              key={match.id}
              match={match}
              action={actionElement}
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
