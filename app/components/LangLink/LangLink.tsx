import Link from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';
import type { Lang } from '../../i18n/types';

type LangLinkProps = {
  lang: Lang;
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function LangLink({ lang, href, children, className, onClick }: LangLinkProps) {
  const normalized = href.startsWith('/') ? href : `/${href}`;
  return (
    <Link href={`/${lang}${normalized}`} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
