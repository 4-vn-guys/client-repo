import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { AppGoogleOAuthProvider, ThemeProvider } from '@/shared/providers';
import QueryProvider from '@/shared/providers/query-provider';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cookies } from 'next/headers';
import { defaultLocale, isLocale } from '@/shared/i18n/request';
import './globals.css';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
});

const openSansMono = Open_Sans({
  variable: '--font-open-sans-mono',
  subsets: ['latin'],
});

/** Absolute site URL for Open Graph / Twitter image resolution (set in env for prod or non-default dev port). */
const metadataBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: 'CourtConnect - Book Sports Courts Instantly',
  description:
    'Book football, badminton, and pickleball courts instantly. Find premium venues, check real-time availability, and secure your spot in minutes.',
  assets: ['/images/background-home.jpeg'],
  category: 'website',
  creator: 'FunnyBois',
  keywords: [
    'sports',
    'court',
    'booking',
    'instant',
    'premium',
    'venues',
    'availability',
    'secure',
    'minutes',
  ],
  openGraph: {
    images: ['/images/background-home.jpeg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const preferredLocale = store.get('locale')?.value;
  const locale =
    preferredLocale && isLocale(preferredLocale)
      ? preferredLocale
      : defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${openSans.variable} ${openSansMono.variable} font-stretch-105% antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <AppGoogleOAuthProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <QueryProvider>
                <Toaster position='top-right' />
                {children}
              </QueryProvider>
              <SpeedInsights />
            </ThemeProvider>
          </AppGoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
