import { BsFacebook, BsWhatsapp } from 'react-icons/bs';
import { getT } from '../../i18n/getT';
import type { Lang } from '../../i18n/types';
import LangLink from '../LangLink/LangLink';
import styles from './Footer.module.scss';

type FooterProps = { lang: Lang };

export default function Footer({ lang }: FooterProps) {
  const t = getT(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.logoAndNav}>
            <LangLink lang={lang} href='/' className={styles.logo}>
              <img src='/images/logo-main-white.png' />
            </LangLink>

            <nav className={styles.nav}>
              <div className={styles.pages}>
                <LangLink lang={lang} href='/news'>
                  {t('footer.news')}
                </LangLink>
                <LangLink lang={lang} href='/articles'>
                  {t('footer.articles')}
                </LangLink>
              </div>
            </nav>
          </div>
          <p className={styles.copyright}>
            &copy; {currentYear} {t('footer.copyright')}
          </p>
          <div className={styles.legalAndSocial}>
            <div className={styles.legal}>
              <LangLink lang={lang} href='/privacy'>
                {t('footer.privacy')}
              </LangLink>
              <LangLink lang={lang} href='/cookies'>
                {t('footer.cookies')}
              </LangLink>
            </div>

            <div className={styles.socials}>
              <a
                href='https://www.facebook.com/profile.php?id=61580741230497&locale=es_ES'
                aria-label='facebook'
                target='_blank'>
                <BsFacebook className={styles.socialIcon} />
              </a>

              <a href='https://wa.me/34656369589' aria-label='whatsapp' target='_blank'>
                <BsWhatsapp className={styles.socialIcon} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
