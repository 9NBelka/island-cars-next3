'use client';

import type { User } from '@supabase/supabase-js';

import type { Lang } from '@/app/i18n/types';
import type { Profile as ProfileType } from '@/app/types/profile';

import styles from './Profile.module.scss';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import ProfileBookings from './ProfileBookings/ProfileBookings';

type Props = {
  lang: Lang;
  user: User;
  profile: ProfileType | null;
};

export default function Profile({ lang, user, profile }: Props) {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <ProfileHeader lang={lang} user={user} profile={profile} />

        <ProfileInfo lang={lang} profile={profile} />

        <ProfileBookings lang={lang} />
      </div>
    </section>
  );
}
