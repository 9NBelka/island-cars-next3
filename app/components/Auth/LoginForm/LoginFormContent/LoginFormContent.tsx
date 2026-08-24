'use client';

import { Formik, Form } from 'formik';
import { BsEnvelopeFill, BsLockFill } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormikHelpers } from 'formik';
import clsx from 'clsx';

import { login } from '@/app/services/auth';

import styles from '../../RegisterForm/RegisterFormContent/RegisterFormContent.module.scss';
import loginStyles from '../LoginForm.module.scss';
import { buildLoginSchema, loginInitialValues, LoginValues } from '../validationSchema';
import { getT } from '@/app/i18n/getT';
import { Lang } from '@/app/i18n/types';
import FormField from '../../FormField/FormField';
import LangLink from '@/app/components/LangLink/LangLink';
import { processPendingBooking } from '@/app/services/pendingBooking';

type LoginFormContentProps = {
  lang: Lang;
  onForgotPassword: () => void;
};

export default function LoginFormContent({ lang, onForgotPassword }: LoginFormContentProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const t = getT(lang);
  const schema = buildLoginSchema(t);

  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>,
  ) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await login(values);

      setSuccessMessage('Login successful.');

      // Если перед логином пользователь начал бронирование,
      // создаём его сразу после успешной авторизации.
      const bookingCreated = await processPendingBooking();

      if (bookingCreated) {
        window.location.href = `/${lang}/profile?tab=bookings`;
        return;
      }

      window.location.href = `/${lang}/profile?tab=bookings`;
    } catch (error: unknown) {
      console.error(error);

      const message = error instanceof Error ? error.message : '';

      setErrorMessage(message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={loginInitialValues} validationSchema={schema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <FormField
            name='email'
            label={t('auth.login.email')}
            icon={BsEnvelopeFill}
            type='email'
            placeholder={t('auth.login.emailPlaceholder')}
          />

          <FormField
            name='password'
            label={t('auth.login.password')}
            icon={BsLockFill}
            type='password'
            placeholder={t('auth.login.passwordPlaceholder')}
          />

          <button type='button' className={loginStyles.forgotLink} onClick={onForgotPassword}>
            {t('auth.login.forgotPassword')}
          </button>

          <div className={styles.submitBlock}>
            <button
              type='submit'
              className={clsx(styles.submit, isSubmitting && styles.loading)}
              disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : t('auth.login.submit')}
            </button>
          </div>

          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

          <p className={styles.footerLink}>
            {t('auth.login.noAccount')}{' '}
            <LangLink lang={lang} href='/register'>
              {t('auth.login.signUp')}
            </LangLink>
          </p>
        </Form>
      )}
    </Formik>
  );
}
