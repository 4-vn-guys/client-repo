import { ProShopDashboard } from '@/pages/owner/pro-shop/ui/pro-shop-dashboard';
import { FeatureGate } from '@/features/authorization/ui/feature-gate';

export default async function OwnerVenueProShopPage({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = await params;
  return (
    <FeatureGate featureKey='pro_shop'>
      <ProShopDashboard branchId={venueId} />
    </FeatureGate>
  );
}
