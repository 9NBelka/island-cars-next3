import LoginForm from '../../components/Auth/LoginForm/LoginForm';
import type { Lang } from '../../i18n/types';

type PageProps = { params: Promise<{ lang: Lang }> };

export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params;
  return <LoginForm lang={lang} />;
}
