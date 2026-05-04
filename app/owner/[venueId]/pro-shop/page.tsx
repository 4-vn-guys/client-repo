import { ProShopDashboard } from '@/pages/owner/pro-shop/ui/pro-shop-dashboard';

export default async function OwnerVenueProShopPage({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = await params;
  return <ProShopDashboard branchId={venueId} />;
}
