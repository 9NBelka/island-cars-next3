'use client';

import { useState, type JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BsBoxArrowRight,
  BsCalendarFill,
  BsFileEarmarkTextFill,
  BsFillQuestionCircleFill,
  BsHeadset,
  BsPercent,
  BsPersonFill,
} from 'react-icons/bs';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import { logout } from '@/app/services/auth';

import styles from './ProfileSidebar.module.scss';

export type ProfileTab = 'bookings' | 'personal-data' | 'discounts' | 'fines' | 'faq';

type NavItem = {
  key: ProfileTab;
  labelKey: string;
  icon: JSX.Element;
};

const navItems: NavItem[] = [
  {
    key: 'bookings',
    labelKey: 'profile.sidebar.bookings',
    icon: <BsCalendarFill className={styles.icon} />,
  },
  {
    key: 'personal-data',
    labelKey: 'profile.sidebar.personalData',
    icon: <BsPersonFill className={styles.icon} />,
  },
  // {
  //   key: 'discounts',
  //   labelKey: 'profile.sidebar.discounts',
  //   icon: <BsPercent className={styles.icon} />,
  // },
  // {
  //   key: 'fines',
  //   labelKey: 'profile.sidebar.fines',
  //   icon: <BsFileEarmarkTextFill className={styles.icon} />,
  // },
  // {
  //   key: 'faq',
  //   labelKey: 'profile.sidebar.faq',
  //   icon: <BsFillQuestionCircleFill className={styles.icon} />,
  // },
];

type Props = {
  lang: Lang;
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
};

export default function ProfileSidebar({ lang, activeTab, onChange }: Props) {
  const t = getT(lang);
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    setLoggingOut(true);

    try {
      await logout();
      router.push(`/${lang}`);
      router.refresh();
    } catch {
      setLogoutError(t('profile.sidebar.logoutError'));
      setLoggingOut(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.key}
            type='button'
            className={`${styles.navItem} ${activeTab === item.key ? styles.active : ''}`}
            onClick={() => onChange(item.key)}>
            <div>{item.icon}</div>
            {t(item.labelKey)}
          </button>
        ))}
      </nav>

      {logoutError && <p className={styles.logoutError}>{logoutError}</p>}

      <div className={styles.help}>
        <div className={styles.helpIcon}>
          <BsHeadset className={styles.hIcon} />
        </div>

        <div>
          <h3 className={styles.helpTitle}>{t('profile.sidebar.needHelpTitle')}</h3>
          <p className={styles.helpText}>{t('profile.sidebar.needHelpText')}</p>
        </div>

        <Link href='/contacts' className={styles.helpButton}>
          {t('profile.sidebar.contactUs')}
        </Link>
      </div>

      <div>
        <button
          type='button'
          className={styles.logoutItem}
          onClick={handleLogout}
          disabled={loggingOut}>
          <div>
            <BsBoxArrowRight className={styles.icon} />
          </div>
          {t('profile.sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}
