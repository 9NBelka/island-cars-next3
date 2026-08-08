import RegisterForm from '../../components/Auth/RegisterForm/RegisterForm';
import type { Lang } from '../../i18n/types';

type PageProps = { params: Promise<{ lang: Lang }> };

export default async function RegisterPage({ params }: PageProps) {
  const { lang } = await params;
  return <RegisterForm lang={lang} />;
}
