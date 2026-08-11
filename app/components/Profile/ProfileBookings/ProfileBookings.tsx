'use client';

import { useEffect, useState } from 'react';
import { BsCarFrontFill } from 'react-icons/bs';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import { cancelBooking, getMyBookings } from '@/app/services/bookings';
import type { Booking } from '@/app/types/booking';

import styles from './ProfileBookings.module.scss';
import clsx from 'clsx';
import BookingsList from './BookingsList/BookingsList';

type Props = {
  lang: Lang;
};

export default function ProfileBookings({ lang }: Props) {
  const t = getT(lang);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getMyBookings();

        if (isMounted) {
          setBookings(data);
        }
      } catch {
        if (isMounted) {
          setError(t('profile.bookings.error'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (bookingId: string) => {
    const confirmed = window.confirm(t('profile.bookings.cancelConfirm'));

    if (!confirmed) return;

    setCancelError(null);
    setCancellingId(bookingId);

    try {
      const updated = await cancelBooking(bookingId);

      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? updated : booking)));
    } catch {
      setCancelError(t('profile.bookings.cancelError'));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>{t('profile.bookings.title')}</h2>
          <p>{t('profile.bookings.subtitle')}</p>
        </div>
      </div>

      {isLoading && <p className={styles.loading}>{t('profile.bookings.loading')}</p>}

      {!isLoading && error && <p className={styles.error}>{error}</p>}

      {!isLoading && !error && bookings.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.iconCarBlock}>
            <BsCarFrontFill className={styles.iconCar} />
          </div>
          <h3 className={styles.emptyTitle}>{t('profile.bookings.emptyTitle')}</h3>
          <p className={styles.emptyText}>{t('profile.bookings.emptyText')}</p>
        </div>
      )}

      {!isLoading && !error && bookings.length > 0 && (
        <BookingsList
          bookings={bookings}
          lang={lang}
          cancelError={cancelError}
          cancellingId={cancellingId}
          onCancel={handleCancel}
        />
      )}
    </section>
  );
}
