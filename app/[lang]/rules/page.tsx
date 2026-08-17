import type { Lang } from '@/app/i18n/types';

import Rules from '@/app/components/Rules/Rules';
import { buildMetadata } from '@/app/lib/buildMetadata';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(lang, 'rules', '/rules', { ogType: 'article' });
}

export default async function RulesPage({ params }: PageProps) {
  const { lang } = await params;

  return <Rules lang={lang} />;
}
