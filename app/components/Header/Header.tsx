import { BsPerson } from 'react-icons/bs';
import { getT } from '../../i18n/getT';
import type { Lang } from '../../i18n/types';
import LangLink from '../LangLink/LangLink';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.scss';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

type HeaderProps = { lang: Lang; isScrolled: boolean };

export default function Header({ lang, isScrolled }: HeaderProps) {
  const t = getT(lang);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // ---------------------------------------
    // Проверяем текущего пользователя
    // ---------------------------------------

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;

      setIsAuthenticated(Boolean(data.user));
    });

    // ---------------------------------------
    // Следим за изменением авторизации
    // ---------------------------------------

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      setIsAuthenticated(Boolean(session?.user));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <LangLink lang={lang} href='/' className={styles.logo}>
          <img src='/images/logo-main-white.png' />
        </LangLink>

        <nav className={styles.nav}>
          <LangLink lang={lang} href='/questions'>
            {t('header.nav.questions')}
          </LangLink>
          <LangLink lang={lang} href='/rules'>
            {t('header.nav.rules')}
          </LangLink>
          <LangLink lang={lang} href='/contacts'>
            {t('header.nav.contacts')}
          </LangLink>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher lang={lang} />
          <LangLink
            lang={lang}
            href={isAuthenticated ? '/profile' : '/login'}
            className={styles.signIn}>
            <BsPerson className={styles.signInIcon} />
            {isAuthenticated ? t('header.profile') : t('header.signIn')}
          </LangLink>
        </div>
      </div>
    </header>
  );
}
