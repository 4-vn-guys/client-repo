import { Navigation } from '@/components/local/navigation/navigation';

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
