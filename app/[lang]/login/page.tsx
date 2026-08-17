import { Metadata } from 'next';
import LoginForm from '../../components/Auth/LoginForm/LoginForm';
import type { Lang } from '../../i18n/types';

type PageProps = { params: Promise<{ lang: Lang }> };

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params;
  return <LoginForm lang={lang} />;
}
