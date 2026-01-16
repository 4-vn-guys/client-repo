import { SimpleHeaderLayout } from '@/shared/layouts';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimpleHeaderLayout>{children}</SimpleHeaderLayout>;
}
