'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import type { Lang } from '@/app/i18n/types';
import type { Profile as ProfileType } from '@/app/types/profile';
import { getT } from '@/app/i18n/getT';

import styles from './Profile.module.scss';

import ProfileInfo from './ProfileInfo/ProfileInfo';
import ProfileBookings from './ProfileBookings/ProfileBookings';
import ProfileSidebar, { ProfileTab } from './ProfileSidebar/ProfileSidebar';
import ProfilePlaceholder from './ProfilePlaceholder/ProfilePlaceholder';

const VALID_TABS: ProfileTab[] = ['bookings', 'personal-data', 'discounts', 'fines', 'faq'];

type Props = {
  lang: Lang;
  user: User;
  profile: ProfileType | null;
};

export default function Profile({ lang, user, profile }: Props) {
  const t = getT(lang);
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<ProfileTab>('personal-data');

  useEffect(() => {
    const tabParam = searchParams.get('tab');

    if (tabParam && VALID_TABS.includes(tabParam as ProfileTab)) {
      setActiveTab(tabParam as ProfileTab);
    }
  }, [searchParams]);

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user.email || 'Customer';

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {t('profile.welcome')} <span className={styles.name}>{fullName}</span>
        </h1>

        <div className={styles.layout}>
          <ProfileSidebar lang={lang} activeTab={activeTab} onChange={setActiveTab} />

          <div className={styles.content}>
            {activeTab === 'bookings' && <ProfileBookings lang={lang} />}

            {activeTab === 'personal-data' && (
              <ProfileInfo lang={lang} profile={profile} user={user} />
            )}

            {activeTab === 'discounts' && (
              <ProfilePlaceholder
                title={t('profile.placeholders.discountsTitle')}
                text={t('profile.placeholders.discountsText')}
              />
            )}

            {activeTab === 'fines' && (
              <ProfilePlaceholder
                title={t('profile.placeholders.finesTitle')}
                text={t('profile.placeholders.finesText')}
              />
            )}

            {activeTab === 'faq' && (
              <ProfilePlaceholder
                title={t('profile.placeholders.faqTitle')}
                text={t('profile.placeholders.faqText')}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
