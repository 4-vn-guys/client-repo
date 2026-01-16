import { BaseLayout } from '@/shared/layouts';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseLayout>{children}</BaseLayout>;
}
