import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LANGS } from '../i18n/types';
import type { Lang } from '../i18n/types';
import Footer from '../components/Footer/Footer';
import IslandCarsClient from '../components/Home/IslandCarsClient';
import SyncHtmlLang from '../components/SyncHtmlLang/SyncHtmlLang';
import { buildMetadata } from '../lib/buildMetadata';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const SITE_URL = 'https://rent.islandcars.pro';

type Props = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const base = await buildMetadata(lang, 'home', '/');

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: base.title as string,
      template: '%s | Island Cars',
    },
    icons: {
      icon: '/favicon.png',
    },
    // остальное (description, openGraph, twitter, robots, alternates) —
    // дефолт для маршрутов без собственного generateMetadata;
    // страницы с собственным вызовом buildMetadata полностью его переопределяют
    ...base,
  };
}

type LayoutProps = {
  children: ReactNode;
  params: Promise<{
    lang: string;
  }>;
};

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!LANGS.includes(lang as Lang)) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  const currentLang = lang as Lang;

  return (
    <>
      <SyncHtmlLang lang={currentLang} />
      <IslandCarsClient currentLang={currentLang} />
      <main>{children}</main>
      <Footer lang={currentLang} />
    </>
  );
}
