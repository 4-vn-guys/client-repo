import { getTranslations } from 'next-intl/server';

export default async function MembersPage() {
  const tOwnerPages = await getTranslations('OwnerPages');

  return (
    <div>
      <h1>{tOwnerPages('members')}</h1>
    </div>
  );
}
