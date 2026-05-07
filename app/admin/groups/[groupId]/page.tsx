import type React from 'react';
import { GroupDetailClient } from './group-detail-client';

export default async function AdminGroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return <GroupDetailClient groupId={groupId} />;
}

