import type { Lang } from '@/app/i18n/types';

import Rules from '@/app/components/Rules/Rules';

type PageProps = {
  params: Promise<{ lang: Lang }>;
};

export default async function RulesPage({ params }: PageProps) {
  const { lang } = await params;

  return <Rules lang={lang} />;
}
