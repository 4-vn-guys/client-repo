import { MapPin, Clock, Info, ArrowRight, Phone, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Branch } from '../model/types';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';

import { memo } from 'react';

// ... existing imports

interface BranchCardProps {
  branch: Branch;
}

export const BranchCard = memo(function BranchCard({
  branch,
}: BranchCardProps) {
  // Format time from HH:MM:SS to HH:MM
  const formatTime = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Get HH:MM from HH:MM:SS
  };

  const operatingHours = `${formatTime(branch.openTime)} - ${formatTime(branch.closeTime)}`;

  return (
    <Card className='group border-border/50 hover:border-primary/50 relative h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg'>
        {/* Header with Avatar and Status */}
        <CardHeader className='p-4 pb-3'>
          <div className='flex items-start gap-3'>
            <Avatar className='ring-background h-12 w-12 shadow-sm ring-2'>
              <AvatarImage
                src={branch.avatar}
                alt={branch.name}
                className='object-cover'
              />
              <AvatarFallback className='from-primary/20 to-primary/5 text-primary bg-linear-to-br font-semibold'>
                {branch.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='min-w-0 flex-1'>
              <h3 className='group-hover:text-primary line-clamp-1 text-base leading-tight font-bold transition-colors'>
                {branch.name}
              </h3>
              <Badge
                variant={branch.isActive ? 'default' : 'secondary'}
                className={cn(
                  'mt-1.5 text-xs',
                  branch.isActive
                    ? 'border-green-200/50 bg-green-500/15 text-green-700 hover:bg-green-500/25'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                )}
              >
                {branch.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className='space-y-2.5 p-4 pt-0'>
          <div className='text-muted-foreground flex items-start gap-2 text-sm'>
            <MapPin className='text-primary/60 mt-0.5 h-4 w-4 shrink-0' />
            <span className='line-clamp-2 leading-relaxed'>
              {branch.address}
            </span>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <Clock className='text-primary/60 h-4 w-4 shrink-0' />
            <span>{operatingHours}</span>
          </div>
          {branch.hotline && (
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <Phone className='text-primary/60 h-4 w-4 shrink-0' />
              <span className='font-medium'>{branch.hotline}</span>
            </div>
          )}
          {branch.policyFile ? (
            <a
              href={branch.policyFile.url}
              target='_blank'
              rel='noreferrer'
              className='text-primary bg-primary/5 border-primary/15 hover:bg-primary/10 flex items-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition-colors'
            >
              <FileText className='h-3.5 w-3.5 shrink-0' />
              <span className='line-clamp-1'>
                View policy: {branch.policyFile.fileName}
              </span>
            </a>
          ) : (
            branch.policy && (
              <div className='text-muted-foreground/80 bg-muted/40 border-border/30 flex items-start gap-2 rounded-lg border p-2.5 text-xs'>
                <Info className='text-muted-foreground/60 mt-0.5 h-3.5 w-3.5 shrink-0' />
                <span className='line-clamp-2 leading-relaxed'>
                  {branch.policy}
                </span>
              </div>
            )
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className='flex justify-end p-4 pt-0'>
          <Link
            href={`/owner/${branch.id}/timeline`}
            className='text-primary flex -translate-x-2 items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100'
          >
            View Schedule <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </CardFooter>
      </Card>
  );
});
