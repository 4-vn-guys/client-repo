import { getTranslations } from 'next-intl/server';

export default async function CourtStatusPage() {
  const tOwnerPages = await getTranslations('OwnerPages');

  return (
    <div>
      <h1>{tOwnerPages('courtStatus')}</h1>
    </div>
  );
}
