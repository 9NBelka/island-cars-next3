'use client';

import { useEffect } from 'react';

import type { Lang } from '@/app/i18n/types';

type Props = {
  lang: Lang;
};

export default function SyncHtmlLang({ lang }: Props) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
