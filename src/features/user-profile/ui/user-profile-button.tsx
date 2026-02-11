'use client';

import { User, Settings, LogOut, Eye, Edit } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { useUserProfile } from '../model/use-user-profile';

interface UserProfileButtonProps {
    name: string;
    role: string;
    email?: string;
    avatar?: string;
    className?: string;
}

/**
 * User Profile Button with Dropdown Menu
 * Interactive user profile component for sidebar with menu options
 */
export function UserProfileButton({
    name,
    role,
    email,
    avatar,
    className,
}: UserProfileButtonProps) {
    const { handleAction } = useUserProfile();

    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2',
                        'transition-colors duration-200',
                        'hover:bg-accent focus:bg-accent',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        className
                    )}
                    aria-label="Open user menu"
                >
                    <Avatar className="size-10 bg-primary/20">
                        <AvatarImage src={avatar || '/placeholder.svg'} alt={name} />
                        <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-medium">{name}</p>
                        <p className="text-muted-foreground truncate text-xs">{role}</p>
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56 animate-in fade-in-0 zoom-in-95"
                align="end"
                side="top"
                sideOffset={8}
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{name}</p>
                        {email && (
                            <p className="text-muted-foreground text-xs leading-none">
                                {email}
                            </p>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => handleAction('view-profile')}
                        className="cursor-pointer"
                    >
                        <Eye className="mr-2 size-4" />
                        <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleAction('edit-profile')}
                        className="cursor-pointer"
                    >
                        <Edit className="mr-2 size-4" />
                        <span>Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleAction('settings')}
                        className="cursor-pointer"
                    >
                        <Settings className="mr-2 size-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleAction('logout')}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
