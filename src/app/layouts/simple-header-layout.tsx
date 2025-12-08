import { Navigation } from '@/src/widgets/navigation';

interface SimpleHeaderLayoutProps {
  children: React.ReactNode;
}

export function SimpleHeaderLayout({ children }: SimpleHeaderLayoutProps) {
  return (
    <div>
      <Navigation simpleHeader={true} />
      {children}
    </div>
  );
}
