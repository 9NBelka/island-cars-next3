import type { Lang } from '@/app/i18n/types';

import Privacy from '@/app/components/Privacy/Privacy';
import { buildMetadata } from '@/app/lib/buildMetadata';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(lang, 'privacy', '/privacy', { ogType: 'article' });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { lang } = await params;

  return <Privacy lang={lang} />;
}
