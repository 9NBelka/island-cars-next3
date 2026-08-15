import { Suspense } from 'react';

import ResetPasswordForm from '../../components/Auth/ResetPasswordForm/ResetPasswordForm';
import type { Lang } from '../../i18n/types';

type PageProps = { params: Promise<{ lang: Lang }> };

export default async function ResetPasswordPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <Suspense fallback={null}>
      <ResetPasswordForm lang={lang} />
    </Suspense>
  );
}
