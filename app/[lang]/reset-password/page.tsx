import ResetPasswordForm from '../../components/Auth/ResetPasswordForm/ResetPasswordForm';
import type { Lang } from '../../i18n/types';

type PageProps = { params: Promise<{ lang: Lang }> };

export default async function ResetPasswordPage({ params }: PageProps) {
  const { lang } = await params;

  return <ResetPasswordForm lang={lang} />;
}
