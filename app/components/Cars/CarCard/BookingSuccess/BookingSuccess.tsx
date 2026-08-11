'use client';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import LangLink from '@/app/components/LangLink/LangLink';

import styles from './BookingSuccess.module.scss';

type Props = {
  lang: Lang;
};

export default function BookingSuccess({ lang }: Props) {
  const t = getT(lang);

  return (
    <div className={styles.success}>
      <div className={styles.successBlock}>
        <div>
          <h2 className={styles.title}>{t('booking.success.title')}</h2>
          <p className={styles.text}>{t('booking.success.text')}</p>
        </div>

        <div className={styles.buttonBlock}>
          <LangLink lang={lang} href='/profile?tab=bookings' className={styles.button}>
            {t('booking.success.button')}
          </LangLink>
        </div>
      </div>
    </div>
  );
}
