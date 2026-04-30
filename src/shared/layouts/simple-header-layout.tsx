'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/src/widgets/navigation';

interface SimpleHeaderLayoutProps {
  children: React.ReactNode;
}

export function SimpleHeaderLayout({ children }: SimpleHeaderLayoutProps) {
  const pathname = usePathname();
  const shouldHideNavigation =
    pathname === '/login' || pathname === '/register';

  return (
    <div>
      {!shouldHideNavigation && <Navigation simpleHeader={true} />}
      {children}
    </div>
  );
}
