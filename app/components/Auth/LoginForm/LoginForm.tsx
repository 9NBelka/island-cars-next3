'use client';

import { Formik, Form } from 'formik';
import { BsEnvelopeFill, BsLockFill } from 'react-icons/bs';
import { getT } from '../../../i18n/getT';
import type { Lang } from '../../../i18n/types';
import LangLink from '../../LangLink/LangLink';
import FormField from '../FormField/FormField';
import { buildLoginSchema, loginInitialValues, type LoginValues } from './validationSchema';
import styles from '../RegisterForm/RegisterForm.module.scss';
import loginStyles from './LoginForm.module.scss';
import clsx from 'clsx';
import { login } from '@/app/services/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormikHelpers } from 'formik';

type LoginFormProps = { lang: Lang };

export default function LoginForm({ lang }: LoginFormProps) {
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

      // console.log('Redirect...');
      // router.push(`/${lang}/profile`);

      setSuccessMessage('Login successful.');

      window.location.href = `/${lang}/profile`;
    } catch (error: any) {
      console.error(error);

      setErrorMessage(error.message ?? 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.mainBlock}>
      <div className={clsx(styles.card, styles.cardLogin)}>
        <h1 className={styles.title}>{t('auth.login.title')}</h1>
        <p className={styles.subtitle}>{t('auth.login.subtitle')}</p>

        <Formik
          initialValues={loginInitialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}>
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

              <LangLink lang={lang} href='/forgot-password' className={loginStyles.forgotLink}>
                {t('auth.login.forgotPassword')}
              </LangLink>

              <div className={styles.submitBlock}>
                <button
                  type='submit'
                  className={`${styles.submit} ${isSubmitting ? styles.loading : ''}`}
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
      </div>
    </div>
  );
}
