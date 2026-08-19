'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Lang } from '../../i18n/types';
import { LANGS } from '../../i18n/types';
import styles from './LanguageSwitcher.module.scss';
import { BsChevronDown } from 'react-icons/bs';
import clsx from 'clsx';
import { LANG_SWITCH_SCROLL_KEY } from '../ScrollRestorer/ScrollRestorer';

const LABELS: Record<Lang, { label: string; flag: string }> = {
  en: { label: 'English', flag: '/images/flag-ukingdom.png' },
  es: { label: 'Español', flag: '/images/flag-espania.png' },
};

type LanguageSwitcherProps = { lang: Lang };

export default function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const current = LABELS[lang] ?? LABELS.en;

  const handleSelect = (newLang: Lang) => {
    setOpen(false);
    if (newLang === lang) return;

    sessionStorage.setItem(LANG_SWITCH_SCROLL_KEY, String(window.scrollY));

    const segments = pathname.split('/');
    segments[1] = newLang;

    router.push(segments.join('/') || `/${newLang}`, { scroll: false });
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.trigger} onClick={() => setOpen((v) => !v)}>
        <div className={styles.flagBlock}>
          <img className={styles.flag} src={current.flag}></img>
        </div>
        <span>{current.label}</span>
        <BsChevronDown className={clsx(open && styles.open, styles.selectArrow)} />
      </button>
      {open && (
        <ul className={styles.dropdown}>
          {LANGS.map((code) => (
            <li key={code}>
              <button onClick={() => handleSelect(code)}>
                <div className={styles.flagBlock}>
                  <img className={styles.flag} src={LABELS[code].flag}></img>
                </div>{' '}
                {LABELS[code].label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
