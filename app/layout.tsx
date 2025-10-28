import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
});

const openSansMono = Open_Sans({
  variable: '--font-open-sans-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CourtConnect - Book Sports Courts Instantly',
  description:
    'Book football, badminton, and pickleball courts instantly. Find premium venues, check real-time availability, and secure your spot in minutes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${openSans.variable} ${openSansMono.variable} font-stretch-105% antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
