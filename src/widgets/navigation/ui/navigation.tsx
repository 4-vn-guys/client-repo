'use client';

import Link from 'next/link';
import { LanguageSwitcher } from '@/src/features/language-switch';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/src/shared/ui';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  MousePointerClick,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useMemo } from 'react';

interface NavigationProps {
  simpleHeader?: boolean;
}

export const Navigation = ({ simpleHeader = false }: NavigationProps) => {
  const tNavigation = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const { isAuthenticated, logout } = useAuth();

  const links = useMemo(
    () => [
      { href: '/', label: tNavigation('homeLabel') },
      { href: '/find-court', label: tNavigation('findLabel') },
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
          <div className='flex space-x-4'>
            <LanguageSwitcher />
            {!simpleHeader && (
              <Fragment>
                {isAuthenticated ? (
                  <>
                    <Link href='/owner/branches'>
                      <Button
                        variant='outline'
                        icon={<LayoutDashboard />}
                        iconPlacement='left'
                      >
                        {tNavigation('dashboardLabel')}
                      </Button>
                    </Link>
                    <Button
                      variant='ghost'
                      icon={<LogOut />}
                      iconPlacement='left'
                      onClick={() => void logout()}
                    >
                      {tNavigation('logoutLabel')}
                    </Button>
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
    </nav>
  );
};
