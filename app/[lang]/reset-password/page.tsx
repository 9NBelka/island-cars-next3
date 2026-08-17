import { Metadata } from 'next';
import ResetPasswordForm from '../../components/Auth/ResetPasswordForm/ResetPasswordForm';
import type { Lang } from '../../i18n/types';

type PageProps = { params: Promise<{ lang: Lang }> };

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({ params }: PageProps) {
  const { lang } = await params;

  return <ResetPasswordForm lang={lang} />;
}
