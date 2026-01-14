import { MapPin, Clock, Info, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Venue } from '../model/types';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

import { memo } from 'react';

// ... existing imports

interface VenueCardProps {
    venue: Venue;
}

export const VenueCard = memo(function VenueCard({ venue }: VenueCardProps) {
    return (
        <Link href={`/owner/${venue.id}/timeline`}>
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-border/50 hover:border-primary/50 relative overflow-hidden">
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                            {venue.name}
                        </h3>
                        <Badge
                            variant={venue.isActive ? "default" : "secondary"}
                            className={cn(
                                "shrink-0",
                                venue.isActive ? "bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            )}
                        >
                            {venue.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{venue.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>{venue.operatingHours}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground/80 bg-muted/50 p-2 rounded-md">
                        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{venue.policy}</span>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end">
                    <div className="text-xs font-medium text-primary flex items-center opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        View Schedule <ArrowRight className="ml-1 w-3 h-3" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
});
