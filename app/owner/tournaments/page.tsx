import { OwnerTournamentsPage } from '@/pages/owner/tournaments';
import { FeatureGate } from '@/features/authorization/ui/feature-gate';

export default function Page() {
  return (
    <FeatureGate featureKey='tournament'>
      <OwnerTournamentsPage />
    </FeatureGate>
  );
}
