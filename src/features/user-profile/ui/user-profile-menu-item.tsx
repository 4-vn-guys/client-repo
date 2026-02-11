'use client';

import { cn } from '@/shared/lib/utils';

interface UserProfileMenuItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
}

/**
 * User Profile Menu Item
 * Individual menu item with icon, label, and hover states
 */
export function UserProfileMenuItem({
    icon: Icon,
    label,
    onClick,
    variant = 'default',
}: UserProfileMenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                variant === 'default' && [
                    'text-foreground hover:bg-accent hover:text-accent-foreground',
                ],
                variant === 'danger' && [
                    'text-destructive hover:bg-destructive/10',
                ]
            )}
        >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
        </button>
    );
}
