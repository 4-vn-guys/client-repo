import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'vi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'vi';

export const isLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export default getRequestConfig(async () => {
  const store = await cookies();
  const preferredLocale = store.get('locale')?.value;
  const locale =
    preferredLocale && isLocale(preferredLocale)
      ? preferredLocale
      : defaultLocale;

  return {
    locale,
    messages: (await import(`@/shared/i18n/messages/${locale}.json`)).default,
  };
});
