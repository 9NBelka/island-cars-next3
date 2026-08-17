import type { Metadata } from 'next';

import HomePage from '../components/Home/HomePage';
import type { Lang } from '../i18n/types';
import { buildMetadata } from '../lib/buildMetadata';

type PageProps = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(lang, 'home', '/');
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  return <HomePage lang={lang} />;
}
