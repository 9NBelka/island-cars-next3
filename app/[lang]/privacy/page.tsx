import type { Lang } from '@/app/i18n/types';

import Privacy from '@/app/components/Privacy/Privacy';

type PageProps = {
  params: Promise<{ lang: Lang }>;
};

export default async function PrivacyPage({ params }: PageProps) {
  const { lang } = await params;

  return <Privacy lang={lang} />;
}
