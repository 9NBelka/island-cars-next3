import { redirect } from 'next/navigation';

import { createClient } from '@/app/lib/supabaseServer';
import type { Lang } from '../../i18n/types';

import Profile from '@/app/components/Profile/Profile';

type PageProps = {
  params: Promise<{ lang: Lang }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { lang } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${lang}/login`);
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return <Profile lang={lang} user={user} profile={profile} />;
}
