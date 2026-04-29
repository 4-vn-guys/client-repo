import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useTranslations } from 'next-intl';

interface BranchHeaderProps {
  branchCount: number;
  onAddBranch?: () => void;
}

export function BranchHeader({ branchCount, onAddBranch }: BranchHeaderProps) {
  const tVenues = useTranslations('OwnerVenuesPage');

  return (
    <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <div>
        <h1 className='text-foreground text-3xl font-bold tracking-tight'>
          {tVenues('title')}
        </h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          {tVenues('branchCount', { count: branchCount })}
        </p>
      </div>
      <Button
        onClick={onAddBranch}
        className='bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:scale-105 active:scale-95'
      >
        <Plus className='mr-2 h-4 w-4' />
        {tVenues('addNewBranch')}
      </Button>
    </div>
  );
}
