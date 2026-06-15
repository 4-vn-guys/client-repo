'use client';

import Link from 'next/link';
import { LanguageSwitcher } from '@/src/features/language-switch';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useStaffAccess } from '@/features/authorization/model/use-staff-access';
import { useStaffInvitations } from '@/features/authorization/model/use-staff-invitations';
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/ui';
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MousePointerClick,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useEffect, useMemo } from 'react';

interface NavigationProps {
  simpleHeader?: boolean;
}

const initialsOf = (name?: string | null, email?: string | null): string => {
  const source = name?.trim() || email?.trim() || '?';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
};

export const Navigation = ({ simpleHeader = false }: NavigationProps) => {
  const tNavigation = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const { isAuthenticated, user, logout } = useAuth();
  const {
    canViewDashboard,
    isLoading: staffLoading,
    error: staffError,
  } = useStaffAccess();
  const { hasPending, invitations } = useStaffInvitations();

  // Surface membership-lookup failures loudly: a 5xx here silently hides the
  // dashboard entry for staff, which is very confusing to debug otherwise.
  useEffect(() => {
    if (staffError) {
      console.error(
        '[navigation] Staff membership lookup failed — the dashboard link is hidden. ' +
          'Check GET /branches/my-staff-memberships (backend restarted? migration run?):',
        staffError,
      );
    }
  }, [staffError]);

  // Dashboard is for owners/admins, or staff whose effective permissions
  // (resolved from the admin RBAC matrix) include 'dashboard:view'. While the
  // membership check is in flight, render nothing to avoid a flash of the
  // button for plain players.
  const showDashboard =
    user?.role === 'owner' ||
    user?.role === 'admin' ||
    (user?.role === 'user' && !staffLoading && canViewDashboard);

  const links = useMemo(
    () => [
      { href: '/', label: tNavigation('homeLabel') },
      { href: '/find-court', label: tNavigation('findLabel') },
      { href: '/events', label: tNavigation('eventsLabel') },
      { href: '/#featured-venues', label: tNavigation('featuredLabel') },
      { href: '/about', label: tNavigation('aboutLabel') },
    ],
    [tNavigation]
  );

  return (
    <nav className='border-b bg-white shadow-sm'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <div className='text-primary text-2xl font-bold'>
              {tCommon('brandName')}
            </div>
          </div>
          {!simpleHeader && (
            <div className='hidden space-x-8 md:flex'>
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          <div className='flex items-center space-x-4'>
            <LanguageSwitcher />
            {!simpleHeader && (
              <Fragment>
                {isAuthenticated ? (
                  <>
                    {showDashboard && (
                      <Link href='/owner/branches' className='hidden sm:block'>
                        <Button
                          variant='outline'
                          icon={<LayoutDashboard />}
                          iconPlacement='left'
                        >
                          {tNavigation('dashboardLabel')}
                        </Button>
                      </Link>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type='button'
                          className='hover:bg-muted relative flex items-center gap-2 rounded-full p-1 pr-2 transition-colors'
                          aria-label={tNavigation('accountMenuLabel')}
                        >
                          <Avatar className='size-8'>
                            <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>
                              {initialsOf(user?.username, user?.email)}
                            </AvatarFallback>
                          </Avatar>
                          <ChevronDown className='text-muted-foreground size-4' />
                          {hasPending && (
                            <span className='absolute top-0 right-1 size-2 rounded-full bg-amber-500' />
                          )}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-64'>
                        <DropdownMenuLabel>
                          <div className='flex flex-col'>
                            <span className='truncate text-sm font-semibold'>
                              {user?.username || tNavigation('accountMenuLabel')}
                            </span>
                            <span className='text-muted-foreground truncate text-xs font-normal'>
                              {user?.email}
                            </span>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {showDashboard && (
                          <DropdownMenuItem asChild>
                            <Link
                              href='/owner/branches'
                              className='flex w-full items-center gap-2'
                            >
                              <LayoutDashboard className='size-4' />
                              {tNavigation('manageVenueLabel')}
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {user?.role === 'user' && (
                          <DropdownMenuItem asChild>
                            <Link
                              href='/staff-invitations'
                              className='flex w-full items-center gap-2'
                            >
                              <Mail className='size-4' />
                              <span className='flex-1'>
                                {tNavigation('staffInvitationsLabel')}
                              </span>
                              {hasPending && (
                                <span className='rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700'>
                                  {invitations.length}
                                </span>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => void logout()}
                          className='text-destructive flex items-center gap-2'
                        >
                          <LogOut className='size-4' />
                          {tNavigation('logoutLabel')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Link href='/login'>
                      <Button
                        variant='outline'
                        icon={<LogIn />}
                        iconPlacement='left'
                      >
                        {tNavigation('loginLabel')}
                      </Button>
                    </Link>
                    <Link href={'/register'}>
                      <Button icon={<MousePointerClick />} iconPlacement='left'>
                        {tNavigation('signupLabel')}
                      </Button>
                    </Link>
                  </>
                )}
              </Fragment>
            )}
          </div>
        </div>
      </div>
      {!simpleHeader && hasPending && (
        <div className='border-t border-amber-200 bg-amber-50'>
          <div className='mx-auto flex items-center justify-center gap-3 px-4 py-2 sm:px-6 lg:px-8'>
            <Mail className='size-4 shrink-0 text-amber-600' />
            <span className='text-sm text-amber-800'>
              {tNavigation('pendingInviteBanner')}
            </span>
            <Link
              href='/staff-invitations'
              className='text-sm font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900'
            >
              {tNavigation('pendingInviteAction')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
