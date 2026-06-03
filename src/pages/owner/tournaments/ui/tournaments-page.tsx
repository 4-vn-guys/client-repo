'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trophy, Users } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
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
import {
  createTournament,
  fetchBranchTournaments,
  fetchTournamentRegistrations,
  type CreateTournamentInput,
  type Tournament,
  type TournamentFormat,
  type TournamentRegistration,
  type TournamentStatus,
} from '@/entities/tournament/api';
import { useActiveVenue } from '@/widgets/owner/venue-switcher';

const FORMAT_LABEL: Record<TournamentFormat, string> = {
  single_elim: 'Single elimination',
  double_elim: 'Double elimination',
  round_robin: 'Round robin',
};

const STATUS_VARIANT: Record<TournamentStatus, 'outline' | 'secondary' | 'default' | 'destructive'> = {
  draft: 'outline',
  open: 'secondary',
  live: 'default',
  completed: 'outline',
};

export function OwnerTournamentsPage() {
  const { activeVenueId, activeVenue, isLoading: venueLoading } = useActiveVenue();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ['owner-tournaments', activeVenueId],
    queryFn: () => fetchBranchTournaments(activeVenueId as string),
    enabled: !!activeVenueId,
  });

  const tournaments = listQuery.data ?? [];

  if (venueLoading) {
    return <div className='text-muted-foreground p-8 text-sm'>Loading venue…</div>;
  }
  if (!activeVenueId) {
    return (
      <div className='p-8 text-sm'>No active venue. Pick one from the sidebar.</div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Tournaments</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Brackets, registrations, and court allocation for{' '}
            <strong>{activeVenue?.name}</strong>.
          </p>
        </div>
        <Button
          icon={<Plus className='size-4' />}
          onClick={() => setCreateOpen(true)}
        >
          New tournament
        </Button>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1fr_1.2fr]'>
        <Card className='gap-0 py-0'>
          <CardHeader className='border-b'>
            <CardTitle className='text-sm'>Tournaments</CardTitle>
            <CardDescription>
              {tournaments.length} total · click one to see registrations
            </CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            {listQuery.isLoading ? (
              <div className='text-muted-foreground p-6 text-sm'>Loading…</div>
            ) : listQuery.isError ? (
              <div className='p-6 text-sm text-red-600'>
                {(listQuery.error as Error).message}
              </div>
            ) : tournaments.length === 0 ? (
              <div className='text-muted-foreground p-6 text-sm'>
                No tournaments yet. Click <strong>New tournament</strong> to add one.
              </div>
            ) : (
              <div className='divide-y'>
                {tournaments.map(t => (
                  <TournamentRow
                    key={t.id}
                    tournament={t}
                    selected={selectedId === t.id}
                    onSelect={() => setSelectedId(t.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <RegistrationsPanel tournamentId={selectedId} tournaments={tournaments} />
      </div>

      <CreateTournamentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        branchId={activeVenueId}
      />
    </div>
  );
}

function TournamentRow({
  tournament,
  selected,
  onSelect,
}: {
  tournament: Tournament;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-start gap-3 p-4 text-left transition-colors ${
        selected ? 'bg-muted/60' : 'hover:bg-muted/30'
      }`}
    >
      <Trophy className='text-primary mt-0.5 size-4 shrink-0' />
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='truncate font-semibold'>{tournament.name}</span>
          <Badge variant={STATUS_VARIANT[tournament.status]} className='capitalize'>
            {tournament.status}
          </Badge>
        </div>
        <div className='text-muted-foreground mt-0.5 text-xs'>
          {FORMAT_LABEL[tournament.format]} · capacity {tournament.capacity} ·{' '}
          fee ${tournament.entryFee.toLocaleString()}
        </div>
        {tournament.startsAt && (
          <div className='text-muted-foreground mt-0.5 text-xs'>
            Starts {new Date(tournament.startsAt).toLocaleString()}
          </div>
        )}
      </div>
    </button>
  );
}

function RegistrationsPanel({
  tournamentId,
  tournaments,
}: {
  tournamentId: string | null;
  tournaments: Tournament[];
}) {
  const selected = tournaments.find(t => t.id === tournamentId) ?? null;

  const regQuery = useQuery({
    queryKey: ['tournament-registrations', tournamentId],
    queryFn: () => fetchTournamentRegistrations(tournamentId as string),
    enabled: !!tournamentId,
  });

  return (
    <Card className='gap-0 py-0'>
      <CardHeader className='border-b'>
        <CardTitle className='text-sm'>
          {selected ? `${selected.name} · registrations` : 'Registrations'}
        </CardTitle>
        <CardDescription>
          {selected
            ? `${regQuery.data?.length ?? 0} of ${selected.capacity} teams`
            : 'Select a tournament to see registered teams'}
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        {!tournamentId ? (
          <div className='text-muted-foreground p-6 text-sm'>
            Pick a tournament on the left.
          </div>
        ) : regQuery.isLoading ? (
          <div className='text-muted-foreground p-6 text-sm'>Loading…</div>
        ) : regQuery.isError ? (
          <div className='p-6 text-sm text-red-600'>
            {(regQuery.error as Error).message}
          </div>
        ) : (regQuery.data?.length ?? 0) === 0 ? (
          <div className='text-muted-foreground p-6 text-sm'>
            No registrations yet.
          </div>
        ) : (
          <div className='divide-y'>
            {regQuery.data!.map(r => (
              <RegistrationRow key={r.id} registration={r} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RegistrationRow({ registration }: { registration: TournamentRegistration }) {
  return (
    <div className='flex items-start gap-3 p-4'>
      <Users className='text-muted-foreground mt-0.5 size-4 shrink-0' />
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='truncate font-semibold'>{registration.teamName}</span>
          <Badge variant='secondary' className='capitalize'>
            {registration.level}
          </Badge>
          {registration.status && (
            <Badge variant='outline' className='capitalize'>
              {registration.status}
            </Badge>
          )}
        </div>
        {registration.createdAt && (
          <div className='text-muted-foreground mt-0.5 text-xs'>
            Registered {new Date(registration.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateTournamentDialog({
  open,
  onOpenChange,
  branchId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  branchId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <CreateTournamentDialogContent
          branchId={branchId}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  );
}

function CreateTournamentDialogContent({
  branchId,
  onOpenChange,
}: {
  branchId: string;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<CreateTournamentInput>(() => ({
    branchId,
    name: '',
    format: 'single_elim',
    capacity: 16,
    entryFee: 0,
    startsAt: null,
    endsAt: null,
  }));

  const mutation = useMutation({
    mutationFn: createTournament,
    onSuccess: () => {
      toast.success('Tournament created');
      qc.invalidateQueries({ queryKey: ['owner-tournaments', branchId] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Create failed'),
  });

  function toIsoOrNull(value: string): string | null {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.valueOf()) ? null : d.toISOString();
  }

  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>New tournament</DialogTitle>
        <DialogDescription>
          Sets up the tournament shell. Players register via the public listing.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (mutation.isPending) return;
          mutation.mutate(form);
        }}
        className='space-y-4'
      >
        <div className='space-y-1.5'>
          <Label htmlFor='t-name'>Name</Label>
          <Input
            id='t-name'
            required
            minLength={2}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder='Spring Doubles Open'
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='t-format'>Format</Label>
          <Select
            value={form.format}
            onValueChange={v => setForm(f => ({ ...f, format: v as TournamentFormat }))}
          >
            <SelectTrigger id='t-format'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='single_elim'>{FORMAT_LABEL.single_elim}</SelectItem>
              <SelectItem value='double_elim'>{FORMAT_LABEL.double_elim}</SelectItem>
              <SelectItem value='round_robin'>{FORMAT_LABEL.round_robin}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='t-capacity'>Capacity</Label>
            <Input
              id='t-capacity'
              type='number'
              min={2}
              max={256}
              value={form.capacity}
              onChange={e =>
                setForm(f => ({ ...f, capacity: Number(e.target.value) }))
              }
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='t-fee'>Entry fee</Label>
            <Input
              id='t-fee'
              type='number'
              min={0}
              step={1000}
              value={form.entryFee}
              onChange={e =>
                setForm(f => ({ ...f, entryFee: Number(e.target.value) }))
              }
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='t-starts'>Starts</Label>
            <Input
              id='t-starts'
              type='datetime-local'
              onChange={e =>
                setForm(f => ({ ...f, startsAt: toIsoOrNull(e.target.value) }))
              }
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='t-ends'>Ends</Label>
            <Input
              id='t-ends'
              type='datetime-local'
              onChange={e =>
                setForm(f => ({ ...f, endsAt: toIsoOrNull(e.target.value) }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type='submit' isLoading={mutation.isPending}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
