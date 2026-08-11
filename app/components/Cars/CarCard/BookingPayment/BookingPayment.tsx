'use client';

import { useState } from 'react';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import { createBooking, type PaymentMethod } from '@/app/services/bookings';

import styles from './BookingPayment.module.scss';

type BookingPaymentProps = {
  lang: Lang;
  carId: string;
  pickupPlace: string;
  returnPlace: string;
  startAt: string;
  endAt: string;
  totalPrice: number;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function BookingPayment({
  lang,
  carId,
  pickupPlace,
  returnPlace,
  startAt,
  endAt,
  totalPrice,
  onCancel,
  onSuccess,
}: BookingPaymentProps) {
  const t = getT(lang);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isBooking, setIsBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const handleApplyPromo = () => {
    const code = promoCode.trim();

    if (!code) {
      return;
    }

    // Пока просто сохраняем введённый промокод.
    // Позже здесь будет проверка через API / Supabase.
    setAppliedPromoCode(code);
  };

  const handleBook = async () => {
    setBookError(null);
    setIsBooking(true);

    try {
      await createBooking({
        carId,
        pickupPlace,
        returnPlace,
        startAt,
        endAt,
        totalPrice,
        paymentMethod,
      });

      onSuccess();
    } catch (error) {
      if (error instanceof Error && error.message === 'NOT_AUTHENTICATED') {
        setBookError(t('booking.payment.authRequiredError'));
      } else {
        setBookError(t('booking.payment.bookError'));
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <section className={styles.payment}>
      <div className={styles.promoBlock}>
        <label htmlFor='promo-code' className={styles.label}>
          {t('booking.payment.promoLabel')}
        </label>

        <div className={styles.promoRow}>
          <input
            id='promo-code'
            type='text'
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            className={styles.promoInput}
            placeholder={t('booking.payment.promoPlaceholder')}
          />

          <button type='button' className={styles.applyButton} onClick={handleApplyPromo}>
            {t('booking.payment.promoApply')}
          </button>
        </div>

        {appliedPromoCode && (
          <p className={styles.successMessage}>
            {t('booking.payment.promoApplied').replace('{{code}}', appliedPromoCode)}
          </p>
        )}
      </div>

      {/* PAYMENT */}
      <div className={styles.paymentBlock}>
        <p className={styles.label}>{t('booking.payment.paymentLabel')}</p>

        <p className={styles.total}>
          {t('booking.payment.totalLabel')} <strong>{totalPrice.toFixed(1)} €</strong>
        </p>

        <div className={styles.paymentOptions}>
          <label className={styles.paymentOption}>
            <input
              type='radio'
              name='payment-method'
              value='cash'
              checked={paymentMethod === 'cash'}
              onChange={() => setPaymentMethod('cash')}
            />

            <span className={styles.radio} />

            <span>{t('booking.payment.cashOption')}</span>
          </label>
        </div>
      </div>

      {/* CANCELLATION POLICY */}
      <div className={styles.cancellation}>
        {t('booking.payment.cancellationPolicy')}
        <br />
        {t('booking.payment.cancellationHint')}
      </div>

      {bookError && <p className={styles.errorMessage}>{bookError}</p>}

      <div className={styles.buttons}>
        <button
          type='button'
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isBooking}>
          {t('booking.payment.cancelButton')}
        </button>
        <button
          type='button'
          className={styles.bookButton}
          onClick={handleBook}
          disabled={isBooking}>
          {isBooking ? t('booking.payment.booking') : t('booking.payment.bookButton')}
        </button>
      </div>
    </section>
  );
}
