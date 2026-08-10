'use client';

import { getT } from '../../../i18n/getT';
import type { Lang } from '../../../i18n/types';

import styles from './RegisterForm.module.scss';
import RegisterFormContent from './RegisterFormContent/RegisterFormContent';

type RegisterFormProps = {
  lang: Lang;
};

export default function RegisterForm({ lang }: RegisterFormProps) {
  const t = getT(lang);

  return (
    <div className={styles.mainBlock}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('auth.register.title')}</h1>
        <p className={styles.subtitle}>{t('auth.register.subtitle')}</p>
        <RegisterFormContent lang={lang} />
      </div>
    </div>
  );
}
