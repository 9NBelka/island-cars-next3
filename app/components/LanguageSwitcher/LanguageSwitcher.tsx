'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Lang } from '../../i18n/types';
import { LANGS } from '../../i18n/types';
import styles from './LanguageSwitcher.module.scss';
import { BsChevronDown } from 'react-icons/bs';
import clsx from 'clsx';

const LABELS: Record<Lang, { label: string; flag: string }> = {
  en: { label: 'English', flag: '/images/flag-ukingdom.png' },
  es: { label: 'Español', flag: '/images/flag-espania.png' },
};

type LanguageSwitcherProps = { lang: Lang };

export default function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const current = LABELS[lang] ?? LABELS.en; // фолбэк — от бага из прошлого раза

  const handleSelect = (newLang: Lang) => {
    setOpen(false);
    if (newLang === lang) return;

    const segments = pathname.split('/');
    segments[1] = newLang; // segments[0] = '', segments[1] = текущий lang
    router.push(segments.join('/') || `/${newLang}`);
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
