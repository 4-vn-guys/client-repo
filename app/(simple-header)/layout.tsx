import { Navigation } from '@/src/features/navigation/navigation';

export default function SimpleHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation simpleHeader={true} />
      {children}
    </div>
  );
}
