'use client';

import { useEffect, useState } from 'react';
import { BsList, BsPerson, BsX } from 'react-icons/bs';
import { getT } from '../../i18n/getT';
import type { Lang } from '../../i18n/types';
import LangLink from '../LangLink/LangLink';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.scss';
import { supabase } from '@/app/lib/supabase';

type HeaderProps = { lang: Lang; isScrolled: boolean };

export default function Header({ lang, isScrolled }: HeaderProps) {
  const t = getT(lang);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Закрываем меню при возврате на десктопную ширину,
  // чтобы оно не осталось "залипшим" открытым после resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <LangLink lang={lang} href='/' className={styles.logo}>
          <img src='/images/logo-main-white.png' />
        </LangLink>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <LangLink lang={lang} href='/questions' onClick={closeMenu}>
            {t('header.nav.questions')}
          </LangLink>
          <LangLink lang={lang} href='/rules' onClick={closeMenu}>
            {t('header.nav.rules')}
          </LangLink>
          <LangLink lang={lang} href='/contacts' onClick={closeMenu}>
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

          <button
            type='button'
            className={styles.burger}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label='Menu'
            aria-expanded={isMenuOpen}>
            {isMenuOpen ? (
              <BsX className={styles.burgerIcon} />
            ) : (
              <BsList className={styles.burgerIcon} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
