import { ProShopBranchPicker } from '@/pages/owner/pro-shop/ui/pro-shop-branch-picker';
import { FeatureGate } from '@/features/authorization/ui/feature-gate';

export default function OwnerProShopLandingPage() {
  return (
    <FeatureGate featureKey='pro_shop'>
      <ProShopBranchPicker />
    </FeatureGate>
  );
}
