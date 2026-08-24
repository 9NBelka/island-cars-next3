'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { getT } from '../../../i18n/getT';
import type { Lang } from '../../../i18n/types';

import { supabase } from '@/app/lib/supabase';
import { processPendingBooking } from '@/app/services/pendingBooking';

import styles from '../RegisterForm/RegisterForm.module.scss';
import LoginFormContent from './LoginFormContent/LoginFormContent';
import ForgotPasswordModal from '../ForgotPasswordModal/ForgotPasswordModal';

type LoginFormProps = {
  lang: Lang;
};

export default function LoginForm({ lang }: LoginFormProps) {
  const t = getT(lang);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let processing = false;

    const processBookingIfNeeded = async () => {
      if (!isMounted || processing) {
        return;
      }

      processing = true;

      try {
        const bookingCreated = await processPendingBooking();

        if (bookingCreated && isMounted) {
          window.location.href = `/${lang}/profile?tab=bookings`;
        }
      } finally {
        processing = false;
      }
    };

    // Проверяем уже существующую сессию.
    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !isMounted) {
        return;
      }

      console.log('🔐 Existing session detected');

      await processBookingIfNeeded();
    };

    void checkInitialSession();

    // Следим за появлением сессии после email confirmation / login.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        return;
      }

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        console.log(`🔐 Auth event: ${event}`);

        // Не вызываем async напрямую внутри callback.
        void processBookingIfNeeded();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [lang]);

  return (
    <div className={styles.mainBlock}>
      <div className={clsx(styles.card, styles.cardLogin)}>
        <h1 className={styles.title}>{t('auth.login.title')}</h1>

        <p className={styles.subtitle}>{t('auth.login.subtitle')}</p>

        <LoginFormContent lang={lang} onForgotPassword={() => setIsForgotPasswordOpen(true)} />
      </div>

      <ForgotPasswordModal
        lang={lang}
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
