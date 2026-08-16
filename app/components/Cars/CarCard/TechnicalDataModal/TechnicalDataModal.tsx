'use client';

import { useEffect, useMemo, useState } from 'react';
import { BsChevronLeft, BsChevronRight, BsX } from 'react-icons/bs';

import type { Car } from '@/app/types/car';

import styles from './TechnicalDataModal.module.scss';

type TechnicalDataModalProps = {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
};

type TechnicalDataItem = {
  label: string;
  value: string | number | null | undefined;
};

export default function TechnicalDataModal({ car, isOpen, onClose }: TechnicalDataModalProps) {
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

  const formatFeatures = (features: Car['features']) => {
    if (Array.isArray(features)) {
      return features.join(', ');
    }

    return features;
  };

  const technicalData: TechnicalDataItem[] = [
    {
      label: 'Transmission type:',
      value: car.transmission,
    },
    {
      label: 'Engine displacement (cm³):',
      value: car.engine_volume,
    },
    {
      label: 'Engine type',
      value: car.fuel_type,
    },
    {
      label: 'Luggage capacity',
      value: car.luggage,
    },
    {
      label: 'Fuel consumption',
      value: car.fuel_consumption ? `${car.fuel_consumption} l/100 km` : null,
    },
    {
      label: 'Equipment',
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
            <h2 id='technical-data-title'>Technical Data</h2>

            <button
              type='button'
              className={styles.closeButton}
              onClick={onClose}
              aria-label='Close'>
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
                    aria-label='Previous image'>
                    <BsChevronLeft className={styles.sliderButtonIcon} />
                  </button>

                  <button
                    type='button'
                    className={`${styles.sliderButton} ${styles.next}`}
                    onClick={goToNextImage}
                    aria-label='Next image'>
                    <BsChevronRight className={styles.sliderButtonIcon} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className={styles.noImage}>No image available</div>
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
      </div>
    </div>
  );
}
