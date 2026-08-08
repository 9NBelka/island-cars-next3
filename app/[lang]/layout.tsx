import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LANGS } from '../i18n/types';
import type { Lang } from '../i18n/types';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../globals.scss';
import IslandCarsClient from '../components/Home/IslandCarsClient';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: 'Island Cars',
  description: 'Discover Spain at your own pace.',
  icons: {
    icon: '/favicon.svg',
  },
};

type LayoutProps = {
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!LANGS.includes(lang as Lang)) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  const currentLang = lang as Lang;

  return (
    <html lang={lang}>
      <body suppressHydrationWarning>
        <IslandCarsClient currentLang={currentLang} />
        <main>{children}</main>
        <Footer lang={currentLang} />
      </body>
    </html>
  );
}
