'use client';

import type { User } from '@supabase/supabase-js';

import type { Lang } from '@/app/i18n/types';
import type { Profile as ProfileType } from '@/app/types/profile';

import styles from './ProfileHeader.module.scss';

type Props = {
  lang: Lang;
  user: User;
  profile: ProfileType | null;
};

export default function ProfileHeader({ user, profile }: Props) {
  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Customer';

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={fullName} className={styles.avatarImage} />
        ) : (
          <span>
            {fullName
              .split(' ')
              .map((word) => word[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </span>
        )}
      </div>

      <div className={styles.info}>
        <h2>{fullName}</h2>

        <p>{user.email}</p>

        <div className={styles.badges}>
          <span className={styles.role}>{profile?.role ?? 'customer'}</span>

          {profile?.is_verified ? (
            <span className={styles.verified}>Verified</span>
          ) : (
            <span className={styles.notVerified}>Not verified</span>
          )}
        </div>
      </div>
    </div>
  );
}
