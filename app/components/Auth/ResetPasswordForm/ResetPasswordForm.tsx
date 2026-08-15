'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, type FormikHelpers } from 'formik';
import { BsLockFill } from 'react-icons/bs';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import { supabase } from '@/app/lib/supabase';
import { updatePassword } from '@/app/services/auth';

import FormField from '../FormField/FormField';
import LangLink from '../../LangLink/LangLink';

import {
  buildResetPasswordSchema,
  resetPasswordInitialValues,
  type ResetPasswordValues,
} from './validationSchema';

import styles from './ResetPasswordForm.module.scss';

type Props = {
  lang: Lang;
};

type SessionStatus = 'checking' | 'ready' | 'invalid';

export default function ResetPasswordForm({ lang }: Props) {
  const t = getT(lang);
  const router = useRouter();

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('checking');
  const [passwordChanged, setPasswordChanged] = useState(false);

  // useRef, а не просто переменную в замыкании — cleanup в следующем
  // useEffect должен видеть самое свежее значение на момент размонтирования,
  // а не то, что было на момент запуска эффекта
  const sessionStatusRef = useRef(sessionStatus);
  const passwordChangedRef = useRef(passwordChanged);

  useEffect(() => {
    sessionStatusRef.current = sessionStatus;
  }, [sessionStatus]);

  useEffect(() => {
    passwordChangedRef.current = passwordChanged;
  }, [passwordChanged]);

  useEffect(() => {
    let resolved = false;

    // Ссылку из письма (?code=... или #access_token=...) супабейз-клиент
    // обрабатывает сам при инициализации — просто слушаем результат,
    // а не пытаемся обменивать код повторно.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        resolved = true;
        setSessionStatus('ready');
      }
    });

    // Подстраховка: вдруг событие уже пролетело до того, как мы подписались
    supabase.auth.getSession().then(({ data }) => {
      if (!resolved && data.session) {
        resolved = true;
        setSessionStatus('ready');
      }
    });

    // Если через несколько секунд ничего не случилось — ссылка невалидна
    const timeout = setTimeout(() => {
      if (!resolved) {
        setSessionStatus('invalid');
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Если пользователь ушёл со страницы, так и не сменив пароль —
  // гасим recovery-сессию, чтобы просто открытая ссылка из письма
  // не давала постоянный доступ к аккаунту.
  useEffect(() => {
    return () => {
      if (sessionStatusRef.current === 'ready' && !passwordChangedRef.current) {
        supabase.auth.signOut();
      }
    };
  }, []);

  const handleSubmit = async (
    values: ResetPasswordValues,
    { setSubmitting, setStatus }: FormikHelpers<ResetPasswordValues>,
  ) => {
    setStatus(undefined);

    try {
      await updatePassword(values.password);

      setPasswordChanged(true);
      setStatus({ success: t('auth.resetPassword.success') });

      setTimeout(() => {
        // Пользователь уже авторизован после восстановления пароля —
        // ведём сразу в профиль, а не на /login (там его и так перекинет).
        router.push(`/${lang}/profile`);
      }, 2000);
    } catch (err) {
      setStatus({
        error: err instanceof Error ? err.message : t('auth.resetPassword.error'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (sessionStatus === 'checking') {
    return (
      <div className={styles.mainBlock}>
        <div className={styles.wrapper}>
          <p className={styles.info}>{t('auth.resetPassword.checking')}</p>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'invalid') {
    return (
      <div className={styles.mainBlock}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>{t('auth.resetPassword.invalidTitle')}</h1>
          <p className={styles.info}>{t('auth.resetPassword.invalidText')}</p>
          <LangLink lang={lang} href='/login' className={styles.link}>
            {t('auth.resetPassword.backToLogin')}
          </LangLink>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainBlock}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{t('auth.resetPassword.title')}</h1>
        <p className={styles.subtitle}>{t('auth.resetPassword.subtitle')}</p>

        <Formik
          initialValues={resetPasswordInitialValues}
          validationSchema={buildResetPasswordSchema(t)}
          onSubmit={handleSubmit}>
          {({ isSubmitting, status }) => (
            <Form className={styles.form}>
              <FormField
                name='password'
                label={t('auth.resetPassword.password')}
                icon={BsLockFill}
                type='password'
                placeholder={t('auth.resetPassword.passwordPlaceholder')}
              />

              <FormField
                name='confirmPassword'
                label={t('auth.resetPassword.confirmPassword')}
                icon={BsLockFill}
                type='password'
                placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
              />

              <button type='submit' className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? t('auth.resetPassword.saving') : t('auth.resetPassword.submit')}
              </button>

              {status?.error && <p className={styles.errorMessage}>{status.error}</p>}
              {status?.success && <p className={styles.successMessage}>{status.success}</p>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
