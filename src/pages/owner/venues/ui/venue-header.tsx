import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface BranchHeaderProps {
    branchCount: number;
    onAddBranch?: () => void;
}

export function BranchHeader({ branchCount, onAddBranch }: BranchHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Branches</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    {branchCount} {branchCount === 1 ? 'branch' : 'branches'} managed
                </p>
            </div>
            <Button
                onClick={onAddBranch}
                className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:scale-105 active:scale-95"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add New Branch
            </Button>
        </div>
    );
}
