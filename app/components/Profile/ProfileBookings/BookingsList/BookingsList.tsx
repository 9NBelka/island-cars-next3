'use client';

import clsx from 'clsx';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import type { Booking } from '@/app/types/booking';

import styles from './BookingsList.module.scss';

type BookingsListProps = {
  bookings: Booking[];
  lang: Lang;
  cancelError: string | null;
  cancellingId: string | null;
  onCancel: (bookingId: string) => void;
};

const LOCALE_MAP: Record<Lang, string> = {
  en: 'en-US',
  es: 'es-ES',
};

const CANCELLABLE_STATUSES = ['pending', 'confirmed'];

function formatDateTime(value: string, lang: Lang) {
  const date = new Date(value);

  const formattedDate = new Intl.DateTimeFormat(LOCALE_MAP[lang], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat(LOCALE_MAP[lang], {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  if (lang === 'es') {
    return `${formattedDate} a las ${formattedTime}`;
  }

  return `${formattedDate} at ${formattedTime}`;
}

export default function BookingsList({
  bookings,
  lang,
  cancelError,
  cancellingId,
  onCancel,
}: BookingsListProps) {
  const t = getT(lang);

  return (
    <div className={styles.list}>
      {cancelError && <p className={styles.error}>{cancelError}</p>}

      {bookings.map((booking) => {
        const canCancel = CANCELLABLE_STATUSES.includes(booking.status);
        const isCancelling = cancellingId === booking.id;

        return (
          <div
            key={booking.id}
            className={clsx(styles.item, `${styles[`status_${booking.status}`]}`)}>
            <div className={styles.itemHeader}>
              <div className={styles.carInfo}>
                <p className={styles.carName}>
                  {booking.car.brand} {booking.car.model}
                </p>
              </div>

              <span className={`${styles.badge} ${styles[`status_${booking.status}`]}`}>
                {t(`profile.bookings.statuses.${booking.status}`)}
              </span>
            </div>

            <div className={styles.grid}>
              <div className={styles.blockFields}>
                <div className={styles.field}>
                  <span className={styles.label}>{t('profile.bookings.pickup')}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.value}>{booking.pickup_place}</span>

                  <span className={clsx(styles.value, styles.valueDate)}>
                    {formatDateTime(booking.start_at, lang)}
                  </span>
                </div>
              </div>

              <div className={styles.blockFields}>
                <div className={styles.field}>
                  <span className={styles.label}>{t('profile.bookings.return')}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.value}>{booking.return_place}</span>

                  <span className={clsx(styles.value, styles.valueDate)}>
                    {formatDateTime(booking.end_at, lang)}
                  </span>
                </div>
              </div>

              <div className={styles.blockFieldsPayment}>
                <div className={styles.field}>
                  <span className={styles.label}>{t('profile.bookings.paymentMethod')}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.value}>
                    {t(`profile.bookings.paymentMethods.${booking.payment_method}`)}
                  </span>
                </div>
              </div>

              <div className={styles.blockFieldsPayment}>
                <div className={styles.field}>
                  <span className={styles.label}>{t('profile.bookings.paymentStatus')}</span>
                </div>
                <div className={styles.field}>
                  <span className={clsx(styles.value, styles[`payment_${booking.payment_status}`])}>
                    {t(`profile.bookings.paymentStatuses.${booking.payment_status}`)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.totalRow}>
              <div className={styles.totalBlock}>
                <p className={styles.totalLabel}>{t('profile.bookings.totalPrice')}</p>
                <p className={styles.totalValue}>{booking.total_price.toFixed(1)} €</p>
              </div>

              <div className={styles.timeBookAndButton}>
                <span className={styles.valueBook}>{formatDateTime(booking.created_at, lang)}</span>
                {canCancel && (
                  <button
                    type='button'
                    className={styles.cancelButton}
                    onClick={() => onCancel(booking.id)}
                    disabled={isCancelling}>
                    {isCancelling
                      ? t('profile.bookings.cancelling')
                      : t('profile.bookings.cancelButton')}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
