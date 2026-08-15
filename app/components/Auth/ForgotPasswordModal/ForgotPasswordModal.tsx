'use client';

import { useEffect } from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import { BsEnvelopeFill, BsXLg } from 'react-icons/bs';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import { requestPasswordReset } from '@/app/services/auth';
import FormField from '../FormField/FormField';

import {
  buildForgotPasswordSchema,
  forgotPasswordInitialValues,
  type ForgotPasswordValues,
} from './validationSchema';

import styles from './ForgotPasswordModal.module.scss';

type Props = {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
};

export default function ForgotPasswordModal({ lang, isOpen, onClose }: Props) {
  const t = getT(lang);
  const schema = buildForgotPasswordSchema(t);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (
    values: ForgotPasswordValues,
    { setSubmitting, setStatus }: FormikHelpers<ForgotPasswordValues>,
  ) => {
    setStatus(undefined);

    try {
      await requestPasswordReset(values.email, lang);
      setStatus({ success: t('auth.forgotPasswordModal.success') });
    } catch (error) {
      setStatus({
        error: error instanceof Error ? error.message : 'Something went wrong.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type='button'
          className={styles.closeButton}
          onClick={onClose}
          aria-label={t('auth.forgotPasswordModal.close')}>
          <BsXLg className={styles.closeIcon} />
        </button>

        <h2 className={styles.title}>{t('auth.forgotPasswordModal.title')}</h2>
        <p className={styles.subtitle}>{t('auth.forgotPasswordModal.subtitle')}</p>

        <Formik
          initialValues={forgotPasswordInitialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}>
          {({ isSubmitting, status }) => (
            <Form className={styles.form}>
              <FormField
                name='email'
                label={t('auth.forgotPasswordModal.email')}
                icon={BsEnvelopeFill}
                type='email'
                placeholder={t('auth.forgotPasswordModal.emailPlaceholder')}
              />

              <button type='submit' className={styles.submit} disabled={isSubmitting}>
                {isSubmitting
                  ? t('auth.forgotPasswordModal.sending')
                  : t('auth.forgotPasswordModal.submit')}
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
