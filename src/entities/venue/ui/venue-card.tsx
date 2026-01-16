import { MapPin, Clock, Info, CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Branch } from '../model/types';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

import { memo } from 'react';

// ... existing imports

interface BranchCardProps {
    branch: Branch;
}

export const BranchCard = memo(function BranchCard({ branch }: BranchCardProps) {
    // Format time from HH:MM:SS to HH:MM
    const formatTime = (time: string) => {
        if (!time) return '';
        return time.substring(0, 5); // Get HH:MM from HH:MM:SS
    };

    const operatingHours = `${formatTime(branch.openTime)} - ${formatTime(branch.closeTime)}`;

    return (
        <Link href={`/owner/${branch.id}/timeline`}>
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-border/50 hover:border-primary/50 relative overflow-hidden">
                {/* Header with Avatar and Status */}
                <CardHeader className="p-4 pb-3">
                    <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12 ring-2 ring-background shadow-sm">
                            <AvatarImage src={branch.avatar} alt={branch.name} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold">
                                {branch.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                {branch.name}
                            </h3>
                            <Badge
                                variant={branch.isActive ? "default" : "secondary"}
                                className={cn(
                                    "mt-1.5 text-xs",
                                    branch.isActive
                                        ? "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200/50"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                )}
                            >
                                {branch.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-4 pt-0 space-y-2.5">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/60" />
                        <span className="line-clamp-2 leading-relaxed">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 shrink-0 text-primary/60" />
                        <span>{operatingHours}</span>
                    </div>
                    {branch.hotline && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 shrink-0 text-primary/60" />
                            <span className="font-medium">{branch.hotline}</span>
                        </div>
                    )}
                    <div className="flex items-start gap-2 text-xs text-muted-foreground/80 bg-muted/40 p-2.5 rounded-lg border border-border/30">
                        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
                        <span className="line-clamp-2 leading-relaxed">{branch.policy}</span>
                    </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-4 pt-0 flex justify-end">
                    <div className="text-xs font-semibold text-primary flex items-center gap-1 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        View Schedule <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
});
