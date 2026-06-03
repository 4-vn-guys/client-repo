import { OwnerYieldPage } from '@/pages/owner/yield';
import { FeatureGate } from '@/features/authorization/ui/feature-gate';

export default function Page() {
  return (
    <FeatureGate featureKey='yield'>
      <OwnerYieldPage />
    </FeatureGate>
  );
}
