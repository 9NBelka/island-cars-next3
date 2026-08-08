'use client';

import type { Lang } from '@/app/i18n/types';

import styles from './ProfileBookings.module.scss';

type Props = {
  lang: Lang;
};

export default function ProfileBookings({}: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>My Bookings</h2>
      </div>

      <div className={styles.empty}>
        <div className={styles.icon}>🚗</div>

        <h3>No bookings yet</h3>

        <p>When you rent your first vehicle, it will appear here.</p>
      </div>
    </section>
  );
}
