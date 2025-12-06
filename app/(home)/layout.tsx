import { BaseLayout } from '@/src/app/layouts';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseLayout>{children}</BaseLayout>;
}
