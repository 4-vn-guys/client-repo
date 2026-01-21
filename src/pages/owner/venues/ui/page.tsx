'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BranchHeader } from './venue-header';
import { BranchesList } from './venues-list';
import { fetchBranches } from '@/entities/venue';

export function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  const handleAddBranch = () => {
    // Navigate to create branch page or open modal
    console.log('Navigate to create branch');
  };

  return (
    <div className='container mx-auto min-h-screen max-w-7xl space-y-8 pt-6'>
      <BranchHeader
        branchCount={branches.length}
        onAddBranch={handleAddBranch}
      />
      <BranchesList
        branches={branches}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
