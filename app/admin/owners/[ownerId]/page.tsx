import { OwnerDetailClient } from './owner-detail-client';

export default async function AdminOwnerDetailPage({
  params,
}: {
  params: Promise<{ ownerId: string }>;
}) {
  const { ownerId } = await params;
  return <OwnerDetailClient ownerId={ownerId} />;
}
