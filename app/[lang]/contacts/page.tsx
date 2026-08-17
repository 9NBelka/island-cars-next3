import Contacts from '@/app/components/Contacts/Contacts';
import type { Lang } from '../../i18n/types';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/lib/buildMetadata';

type PageProps = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(lang, 'contacts', '/contacts');
}

export default async function ContactsPage({ params }: PageProps) {
  const { lang } = await params;
  return <Contacts lang={lang} />;
}
