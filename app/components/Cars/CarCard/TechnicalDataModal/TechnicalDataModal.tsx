'use client';

import { useEffect, useMemo, useState } from 'react';
import { BsChevronLeft, BsChevronRight, BsX } from 'react-icons/bs';
import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import type { CarAvailability } from '@/app/types/carAvailability';

import type { Car } from '@/app/types/car';

import styles from './TechnicalDataModal.module.scss';

type TechnicalDataModalProps = {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  canBook: boolean;
  isAvailable: boolean;
  hasSearchDates: boolean;
  availability: CarAvailability;
  onBook: () => void | Promise<void>;
  lang: Lang;
};

type TechnicalDataItem = {
  label: string;
  value: string | number | null | undefined;
};

export default function TechnicalDataModal({
  car,
  isOpen,
  onClose,
  canBook,
  isAvailable,
  hasSearchDates,
  availability,
  onBook,
  lang,
}: TechnicalDataModalProps) {
  const t = getT(lang);

  const [currentImage, setCurrentImage] = useState(0);

  /*
   * Пока используем изображения машины из базы.
   *
   * Если у тебя в Car другие названия полей для изображений,
   * здесь потом просто поменяем это место.
   */
  const images = useMemo(
    () =>
      (car.images ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((image) => image.image_url),
    [car.images],
  );

  // Предзагружаем все фото машины сразу при открытии модалки —
  // иначе браузер начинает качать картинку только по клику "вперёд/назад",
  // и переключение выглядит как "не среагировало с первого раза".
  useEffect(() => {
    if (!isOpen || images.length === 0) return;

    const preloaded = images.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    return () => {
      // Отменяем незавершённую загрузку, если модалку закрыли раньше времени
      preloaded.forEach((img) => {
        img.src = '';
      });
    };
  }, [isOpen, images]);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentImage(0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft') {
        setCurrentImage((prev) => (prev === 0 ? Math.max(images.length - 1, 0) : prev - 1));
      }

      if (event.key === 'ArrowRight') {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Запрещаем скроллить страницу под модалкой
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, images.length]);

  if (!isOpen) {
    return null;
  }

  const transmissionKey = String(car.transmission).toLowerCase();
  const fuelTypeKey = car.fuel_type?.toLowerCase() as 'petrol' | 'diesel' | 'hybrid' | 'electric';

  const formatFeatures = (features: Car['features']) => {
    if (Array.isArray(features)) {
      return features.join(', ');
    }

    return features;
  };

  const technicalData: TechnicalDataItem[] = [
    {
      label: t('cars.carCard.technicalData.transmissionType'),
      value: t(`cars.carCard.transmissions.${transmissionKey}`),
    },
    {
      label: t('cars.carCard.technicalData.engineDisplacement'),
      value: car.engine_volume,
    },
    {
      label: t('cars.carCard.technicalData.engineType'),
      value: fuelTypeKey ? t(`cars.carCard.fuelTypes.${fuelTypeKey}`) : null,
    },
    {
      label: t('cars.carCard.technicalData.luggageCapacity'),
      value: car.luggage,
    },
    {
      label: t('cars.carCard.technicalData.fuelConsumption'),
      value: car.fuel_consumption ? `${car.fuel_consumption} l/100 km` : null,
    },
    {
      label: t('cars.carCard.technicalData.equipment'),
      value: formatFeatures(car.features),
    },
  ];

  const visibleData = technicalData.filter(
    (item) => item.value !== null && item.value !== undefined && item.value !== '',
  );

  const goToPreviousImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleBackdropClick}>
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby='technical-data-title'>
        <div className={styles.headerAndNameCar}>
          <div className={styles.header}>
            <h2 id='technical-data-title'>{t('cars.carCard.technicalData.title')}</h2>

            <button
              type='button'
              className={styles.closeButton}
              onClick={onClose}
              aria-label={t('cars.carCard.technicalData.closeAria')}>
              <BsX className={styles.closeIcon} />
            </button>
          </div>

          <div className={styles.carName}>
            {car.brand} {car.model} {car.year}
          </div>
        </div>

        <div className={styles.imageWrapper}>
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImage]}
                alt={`${car.brand} ${car.model}`}
                className={styles.carImage}
              />

              {images.length > 1 && (
                <>
                  <button
                    type='button'
                    className={`${styles.sliderButton} ${styles.previous}`}
                    onClick={goToPreviousImage}
                    aria-label={t('cars.carCard.technicalData.previousImageAria')}>
                    <BsChevronLeft className={styles.sliderButtonIcon} />
                  </button>

                  <button
                    type='button'
                    className={`${styles.sliderButton} ${styles.next}`}
                    onClick={goToNextImage}
                    aria-label={t('cars.carCard.technicalData.nextImageAria')}>
                    <BsChevronRight className={styles.sliderButtonIcon} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className={styles.noImage}>{t('cars.carCard.technicalData.noImage')}</div>
          )}
        </div>

        <div className={styles.table}>
          {visibleData.map((item) => (
            <div className={styles.row} key={item.label}>
              <div className={styles.label}>{item.label}</div>

              <div className={styles.value}>{item.value}</div>
            </div>
          ))}
        </div>

        <div className={styles.bookColumn}>
          <button type='button' disabled={!canBook} className={styles.buttonBook} onClick={onBook}>
            {isAvailable ? t('cars.carCard.book') : t(`cars.carCard.status.${availability}`)}
          </button>

          {isAvailable && !hasSearchDates && (
            <p className={styles.selectDatesWarning}>{t('cars.carCard.selectDatesWarning')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
