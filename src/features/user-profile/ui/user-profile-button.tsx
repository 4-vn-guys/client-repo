'use client';

import { Settings, LogOut, Eye, Edit, LayoutDashboard, UserCog } from 'lucide-react';
import { usePathname } from 'next/navigation';
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
import { useTranslations } from 'next-intl';

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
  const { handleAction, user } = useUserProfile();
  const tUserProfile = useTranslations('Components.UserProfile');
  const pathname = usePathname();

  const userRole = user?.role || role;
  const isAdmin = userRole === 'admin';
  const isAdminView = pathname?.startsWith('/admin');

  const initials = name
    .split(' ')
    .map(n => n[0])
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
            'focus-visible:ring-primary focus:outline-none focus-visible:ring-2',
            className
          )}
          aria-label={tUserProfile('openMenu')}
        >
          <Avatar className='bg-primary/20 size-10'>
            <AvatarImage src={avatar || '/placeholder.svg'} alt={name} />
            <AvatarFallback className='bg-primary/20 text-primary text-sm font-medium'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1 text-left'>
            <p className='truncate text-sm font-medium'>{name}</p>
            <p className='text-muted-foreground truncate text-xs'>{role}</p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='animate-in fade-in-0 zoom-in-95 w-56'
        align='end'
        side='top'
        sideOffset={8}
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{name}</p>
            {email && (
              <p className='text-muted-foreground text-xs leading-none'>
                {email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => handleAction('switch-dashboard')}
                className={cn(
                  'cursor-pointer font-medium transition-all duration-200',
                  'text-indigo-600 dark:text-indigo-400',
                  'focus:text-indigo-600 focus:bg-indigo-50 dark:focus:bg-indigo-950/30'
                )}
              >
                {isAdminView ? (
                  <>
                    <LayoutDashboard className='mr-2 size-4 text-indigo-600 dark:text-indigo-400' />
                    <span>{tUserProfile('switchToOwner')}</span>
                  </>
                ) : (
                  <>
                    <UserCog className='mr-2 size-4 text-indigo-600 dark:text-indigo-400' />
                    <span>{tUserProfile('switchToAdmin')}</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleAction('view-profile')}
            className='cursor-pointer'
          >
            <Eye className='mr-2 size-4' />
            <span>{tUserProfile('viewProfile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction('edit-profile')}
            className='cursor-pointer'
          >
            <Edit className='mr-2 size-4' />
            <span>{tUserProfile('editProfile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction('settings')}
            className='cursor-pointer'
          >
            <Settings className='mr-2 size-4' />
            <span>{tUserProfile('settings')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleAction('logout')}
          className='text-destructive focus:text-destructive cursor-pointer'
        >
          <LogOut className='mr-2 size-4' />
          <span>{tUserProfile('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
