import { Search, MapPin } from 'lucide-react';
import { memo } from 'react';
import { Input } from '@/shared/ui/input';
import { BranchCard, Branch } from '@/entities/venue';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

interface BranchesListProps {
  branches: Branch[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateBranch?: () => void;
}

export const BranchesList = memo(function BranchesList({
  branches,
  isLoading,
  searchQuery,
  onSearchChange,
  onCreateBranch,
}: BranchesListProps) {
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='w-full max-w-sm'>
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className='h-[200px] w-full rounded-xl' />
          ))}
        </div>
      </div>
    );
  }

  if (branches.length === 0 && !searchQuery) {
    return (
      <div className='border-border/50 bg-muted/10 animate-in fade-in zoom-in flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center duration-500 lg:p-24'>
        <div className='bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
          <MapPin className='text-primary h-8 w-8' />
        </div>
        <h3 className='mb-2 text-xl font-semibold'>No branches yet</h3>
        <p className='text-muted-foreground mb-6 max-w-sm'>
          Get started by creating your first branch to manage courts and
          bookings.
        </p>
        <Button onClick={onCreateBranch}>Create Branch</Button>
      </div>
    );
  }

  const filteredBranches = branches.filter(
    branch =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='relative max-w-sm'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='Search by name or location...'
          className='bg-background/50 border-input/60 focus-visible:ring-primary/20 pl-9'
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {filteredBranches.length === 0 ? (
        <div className='text-muted-foreground flex flex-col items-center justify-center py-12 text-center'>
          <Search className='mb-4 h-12 w-12 opacity-20' />
          <p>No branches found matching &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 pb-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
          {filteredBranches.map((branch, index) => (
            <div
              key={branch.id}
              className='animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards duration-500'
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BranchCard branch={branch} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
