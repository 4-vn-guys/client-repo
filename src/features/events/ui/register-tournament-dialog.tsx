'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

import type { Tournament, TournamentLevel } from '@/entities/tournament';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import { useRegisterTournament } from '../model/use-register-tournament';
import { tournamentRegistrationSchema } from '../model/validation';

interface RegisterTournamentDialogProps {
  tournament: Tournament | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LEVELS: TournamentLevel[] = ['beginner', 'intermediate', 'pro'];

export function RegisterTournamentDialog({
  tournament,
  open,
  onOpenChange,
}: RegisterTournamentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && tournament && (
        <RegisterTournamentDialogContent
          tournament={tournament}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  );
}

function RegisterTournamentDialogContent({
  tournament,
  onOpenChange,
}: {
  tournament: Tournament;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations('EventsPage');
  const mutation = useRegisterTournament();

  const [teamName, setTeamName] = useState('');
  const [level, setLevel] = useState<TournamentLevel>('beginner');
  const [error, setError] = useState<string | null>(null);

  const levelLabel: Record<TournamentLevel, string> = {
    beginner: t('levelBeginner'),
    intermediate: t('levelIntermediate'),
    pro: t('levelPro'),
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (mutation.isPending) return;

    const parsed = tournamentRegistrationSchema.safeParse({ teamName, level });
    if (!parsed.success) {
      setError(t('teamNameInvalid'));
      return;
    }
    setError(null);

    mutation.mutate(
      { tournamentId: tournament.id, ...parsed.data },
      {
        onSuccess: () => {
          toast.success(t('registerSuccess'));
          onOpenChange(false);
        },
        onError: (e: Error) => toast.error(e.message || t('teamNameInvalid')),
      }
    );
  }

  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>
          {t('registerTitle', { name: tournament.name })}
        </DialogTitle>
        <DialogDescription>{t('registerDescription')}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='team-name'>{t('teamNameLabel')}</Label>
          <Input
            id='team-name'
            required
            minLength={2}
            maxLength={120}
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder={t('teamNamePlaceholder')}
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='team-level'>{t('levelLabel')}</Label>
          <Select
            value={level}
            onValueChange={v => setLevel(v as TournamentLevel)}
          >
            <SelectTrigger id='team-level'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map(l => (
                <SelectItem key={l} value={l}>
                  {levelLabel[l]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className='text-destructive text-sm'>{error}</p>}
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            {t('cancel')}
          </Button>
          <Button type='submit' isLoading={mutation.isPending}>
            {t('submitRegister')}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
