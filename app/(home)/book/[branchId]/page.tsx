import { BookPage } from '@/src/pages/book';

export default async function BookBranchPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  return <BookPage branchId={branchId} />;
}
