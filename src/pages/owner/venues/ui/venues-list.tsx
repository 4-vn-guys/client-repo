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
}

export const BranchesList = memo(function BranchesList({
    branches,
    isLoading,
    searchQuery,
    onSearchChange
}: BranchesListProps) {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="w-full max-w-sm">
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (branches.length === 0 && !searchQuery) {
        return (
            <div className="flex flex-col items-center justify-center p-12 lg:p-24 border-2 border-dashed border-border/50 rounded-xl bg-muted/10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No branches yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    Get started by creating your first branch to manage courts and bookings.
                </p>
                <Button>Create Branch</Button>
            </div>
        );
    }

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or location..."
                    className="pl-9 bg-background/50 border-input/60 focus-visible:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {filteredBranches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p>No branches found matching "{searchQuery}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-20">
                    {filteredBranches.map((branch, index) => (
                        <div
                            key={branch.id}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
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
