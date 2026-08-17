'use client';

import { useEffect } from 'react';
import { BsX } from 'react-icons/bs';

import type { Lang } from '@/app/i18n/types';

import styles from './RegisterPopup.module.scss';
import RegisterFormContent from '@/app/components/Auth/RegisterForm/RegisterFormContent/RegisterFormContent';
import { getT } from '@/app/i18n/getT';

type RegisterPopupProps = {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterPopup({ lang, isOpen, onClose }: RegisterPopupProps) {
  const t = getT(lang);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Запрещаем скролл страницы под попапом
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleBackdropClick}>
      <div className={styles.modal}>
        <button type='button' className={styles.closeButton} onClick={onClose} aria-label='Close'>
          <BsX className={styles.closeIcon} />
        </button>

        <h1 className={styles.title}>{t('cars.register.title')}</h1>
        <p className={styles.subtitle}>{t('cars.register.subtitle')}</p>

        <RegisterFormContent lang={lang} />
      </div>
    </div>
  );
}
