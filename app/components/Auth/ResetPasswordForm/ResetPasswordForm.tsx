'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('checking');

  useEffect(() => {
    const code = searchParams.get('code');

    async function establishSession() {
      if (!code) {
        // На случай если сессия уже установлена автоматически
        // (implicit-флоу с токеном в hash вместо ?code=)
        const { data } = await supabase.auth.getSession();
        setSessionStatus(data.session ? 'ready' : 'invalid');
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      setSessionStatus(error ? 'invalid' : 'ready');
    }

    establishSession();
  }, [searchParams]);

  const handleSubmit = async (
    values: ResetPasswordValues,
    { setSubmitting, setStatus }: FormikHelpers<ResetPasswordValues>,
  ) => {
    setStatus(undefined);

    try {
      await updatePassword(values.password);

      setStatus({ success: t('auth.resetPassword.success') });

      setTimeout(() => {
        router.push(`/${lang}/login`);
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
