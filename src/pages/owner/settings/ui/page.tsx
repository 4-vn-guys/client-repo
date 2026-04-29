import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
  const tOwnerPages = await getTranslations('OwnerPages');

  return (
    <div>
      <h1>{tOwnerPages('settings')}</h1>
    </div>
  );
}
