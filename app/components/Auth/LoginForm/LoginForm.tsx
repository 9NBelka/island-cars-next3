'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { getT } from '../../../i18n/getT';
import type { Lang } from '../../../i18n/types';

import styles from '../RegisterForm/RegisterForm.module.scss';
import LoginFormContent from './LoginFormContent/LoginFormContent';
import ForgotPasswordModal from '../ForgotPasswordModal/ForgotPasswordModal';

type LoginFormProps = {
  lang: Lang;
};

export default function LoginForm({ lang }: LoginFormProps) {
  const t = getT(lang);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

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
