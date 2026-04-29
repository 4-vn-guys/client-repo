import { getTranslations } from 'next-intl/server';

export default async function ReportsPage() {
  const tOwnerPages = await getTranslations('OwnerPages');

  return (
    <div>
      <h1>{tOwnerPages('reports')}</h1>
    </div>
  );
}
