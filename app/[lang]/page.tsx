import HomePage from '../components/Home/HomePage';
import type { Lang } from '../i18n/types';

type PageProps = {
  params: Promise<{ lang: Lang }>;
};

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  return <HomePage lang={lang} />;
}
