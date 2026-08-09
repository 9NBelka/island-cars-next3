'use client';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';

import styles from './ProfileBookings.module.scss';
import { BsCarFrontFill } from 'react-icons/bs';

type Props = {
  lang: Lang;
};

export default function ProfileBookings({ lang }: Props) {
  const t = getT(lang);

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>{t('profile.bookings.title')}</h2>
          <p>{t('profile.bookings.subtitle')}</p>
        </div>
      </div>

      <div className={styles.empty}>
        <div className={styles.iconCarBlock}>
          <BsCarFrontFill className={styles.iconCar} />
        </div>
        <h3 className={styles.emptyTitle}>{t('profile.bookings.emptyTitle')}</h3>

        <p className={styles.emptyText}>{t('profile.bookings.emptyText')}</p>
      </div>
    </section>
  );
}
