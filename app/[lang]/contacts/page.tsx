import Contacts from '@/app/components/Contacts/Contacts';
import type { Lang } from '../../i18n/types';

type PageProps = { params: Promise<{ lang: Lang }> };

export default async function ContactsPage({ params }: PageProps) {
  const { lang } = await params;
  return <Contacts lang={lang} />;
}
