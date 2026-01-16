import { Navigation } from '@/src/widgets/navigation';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className='min-h-screen'>
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
