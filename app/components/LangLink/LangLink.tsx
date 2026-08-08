import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Lang } from '../../i18n/types';

type LangLinkProps = {
  lang: Lang;
  href: string;
  children: ReactNode;
  className?: string;
};

export default function LangLink({ lang, href, children, className }: LangLinkProps) {
  const normalized = href.startsWith('/') ? href : `/${href}`;
  return (
    <Link href={`/${lang}${normalized}`} className={className}>
      {children}
    </Link>
  );
}
