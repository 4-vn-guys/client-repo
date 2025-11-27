import { Navigation } from '@/src/features/navigation/navigation';

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen'>
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
