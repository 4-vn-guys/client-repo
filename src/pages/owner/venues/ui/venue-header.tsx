import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface BranchHeaderProps {
  branchCount: number;
  onAddBranch?: () => void;
}

export function BranchHeader({ branchCount, onAddBranch }: BranchHeaderProps) {
  return (
    <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <div>
        <h1 className='text-foreground text-3xl font-bold tracking-tight'>
          My Branches
        </h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          {branchCount} {branchCount === 1 ? 'branch' : 'branches'} managed
        </p>
      </div>
      <Button
        onClick={onAddBranch}
        className='bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:scale-105 active:scale-95'
      >
        <Plus className='mr-2 h-4 w-4' />
        Add New Branch
      </Button>
    </div>
  );
}
