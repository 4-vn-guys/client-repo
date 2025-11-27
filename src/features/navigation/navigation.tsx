'use client';

import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@shared/ui/button';
import { LogIn, MousePointerClick } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useMemo } from 'react';

interface NavigationProps {
  simpleHeader?: boolean;
}

export const Navigation = ({ simpleHeader = false }: NavigationProps) => {
  const tNavigation = useTranslations('Navigation');

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
            <div className='text-primary text-2xl font-bold'>CourtConnect</div>
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
                <Link href='/login'>
                  <Button variant='outline' iconLeft={<LogIn />}>
                    {tNavigation('loginLabel')}
                  </Button>
                </Link>
                <Link href={'/register'}>
                  <Button iconLeft={<MousePointerClick />}>
                    {tNavigation('signupLabel')}
                  </Button>
                </Link>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
