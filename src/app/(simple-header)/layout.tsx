import { SimpleHeaderLayout } from '@/src/app/layouts';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimpleHeaderLayout>{children}</SimpleHeaderLayout>;
}
