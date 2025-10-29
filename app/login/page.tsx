import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations();
  return <h1>{t('LoginPage.title')}</h1>;
}
