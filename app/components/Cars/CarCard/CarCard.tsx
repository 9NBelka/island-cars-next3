'use client';

import clsx from 'clsx';
import type { SearchCarsParams } from '@/app/types/search';
import { calculateRentalPrice } from '@/app/services/rentalPricing';
import styles from './CarCard.module.scss';
import { useState } from 'react';
import TechnicalDataModal from './TechnicalDataModal/TechnicalDataModal';
import { savePendingBooking } from '@/app/utils/pendingBooking';

import type { Lang } from '@/app/i18n/types';
import { getT } from '@/app/i18n/getT';
import { supabase } from '@/app/lib/supabase';

import type { Car } from '@/app/types/car';
import type { CarAvailability } from '@/app/types/carAvailability';

import {
  BsCarFrontFill,
  BsFillBeakerFill,
  BsFillFuelPumpFill,
  BsFillInfoCircleFill,
  BsFillPeopleFill,
  BsFillPersonFill,
  BsFillSuitcaseLgFill,
} from 'react-icons/bs';

import { TbCarDoor } from 'react-icons/tb';

import RegisterPopup from './RegisterPopup/RegisterPopup';
import BookingPayment from './BookingPayment/BookingPayment';
import BookingSuccess from './BookingSuccess/BookingSuccess';

type CarWithAvailability = Car & {
  availability: CarAvailability;
};

type CarCardProps = {
  car: CarWithAvailability;
  searchParams: SearchCarsParams | null;
  lang: Lang;
};

export default function CarCard({ car, searchParams, lang }: CarCardProps) {
  const t = getT(lang);

  const [isTechnicalDataOpen, setIsTechnicalDataOpen] = useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  // ---------------------------------------
  // CAR STATUS / TRANSLATIONS
  // ---------------------------------------

  const isAvailable = car.availability === 'available';

  const hasSearchDates = Boolean(searchParams?.startAt && searchParams?.endAt);

  const canBook = isAvailable && hasSearchDates;

  const transmissionKey = String(car.transmission).toLowerCase();

  const fuelTypeKey = car.fuel_type?.toLowerCase() as 'petrol' | 'diesel' | 'hybrid' | 'electric';

  const getStatusText = (status: CarAvailability) => {
    return t(`cars.carCard.status.${status}`);
  };

  // ---------------------------------------
  // RENTAL PRICE
  // ---------------------------------------

  const rentalPrice = searchParams
    ? calculateRentalPrice(Number(car.price_per_day), searchParams.startAt, searchParams.endAt)
    : {
        days: 1,
        discountPercent: 0,
        pricePerDay: Number(car.price_per_day),
        totalPrice: Number(car.price_per_day),
      };

  // ---------------------------------------
  // BOOK
  // ---------------------------------------

  const handleBook = async () => {
    if (!canBook || !searchParams) {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Сохраняем параметры брони — используем их сразу после появления сессии,
        // независимо от того, авто-логин это или подтверждение через письмо.
        savePendingBooking({
          carId: car.id,
          pickupPlace: searchParams.pickupPlace,
          returnPlace: searchParams.returnPlace,
          startAt: searchParams.startAt,
          endAt: searchParams.endAt,
          totalPrice: rentalPrice.totalPrice,
          paymentMethod: 'cash', // сейчас на сайте выбор один — наличные
        });

        setIsRegisterPopupOpen(true);
        return;
      }

      setIsBookingOpen(true);
    } catch (error) {
      console.error('Failed to check authentication:', error);
    }
  };

  // ---------------------------------------
  // BOOK FROM TECHNICAL DATA MODAL
  // ---------------------------------------

  const handleBookFromModal = async () => {
    setIsTechnicalDataOpen(false);
    await handleBook();
  };

  // ---------------------------------------
  // RENDER
  // ---------------------------------------

  return (
    <div
      className={clsx(
        styles.card,
        styles[car.availability],
        (isBookingOpen || isBookingSuccess) && styles.hoverOff,
      )}>
      {isBookingSuccess ? (
        <BookingSuccess lang={lang} />
      ) : isBookingOpen && searchParams ? (
        <BookingPayment
          lang={lang}
          carId={car.id}
          pickupPlace={searchParams.pickupPlace}
          returnPlace={searchParams.returnPlace}
          startAt={searchParams.startAt}
          endAt={searchParams.endAt}
          totalPrice={rentalPrice.totalPrice}
          onCancel={() => setIsBookingOpen(false)}
          onSuccess={() => {
            setIsBookingOpen(false);
            setIsBookingSuccess(true);
          }}
        />
      ) : (
        <div className={styles.cardBlockLeftRight}>
          {/* --------------------------------------- */}
          {/* LEFT SIDE */}
          {/* --------------------------------------- */}

          <div
            className={styles.carCharacterBlockAndHeader}
            onClick={() => setIsTechnicalDataOpen(true)}>
            {/* HEADER */}

            <div className={styles.cardHeader}>
              <div className={styles.carNameAndIconBlock}>
                <h2 className={styles.carName}>
                  {car.brand} {car.model}
                </h2>

                <button
                  type='button'
                  className={styles.infoTrigger}
                  onClick={() => setIsTechnicalDataOpen(true)}
                  aria-label='Technical data'>
                  <BsFillInfoCircleFill className={styles.infoTriggerIcon} />
                </button>
              </div>

              <p className={styles.transmissionText}>
                {t(`cars.carCard.transmissions.${transmissionKey}`)}
              </p>
            </div>

            {/* CAR IMAGE */}

            <div className={styles.carShadow}>
              {car.card_image && <img src={car.card_image} alt={`${car.brand} ${car.model}`} />}
            </div>

            {/* CAR CHARACTERISTICS */}

            <div className={styles.carCharacterBlock}>
              <div className={styles.carCharacterBlockIconAndText}>
                <BsFillFuelPumpFill className={styles.carCharacterIcon} />

                <p className={styles.carCharacterText}>
                  {t(`cars.carCard.fuelTypes.${fuelTypeKey}`)}
                </p>
              </div>

              <div className={styles.carCharacterBlockIconAndText}>
                <BsFillSuitcaseLgFill className={styles.carCharacterIcon} />

                <p className={styles.carCharacterText}>{car.luggage}</p>
              </div>

              <div className={styles.carCharacterBlockIconAndText}>
                <TbCarDoor className={styles.carCharacterIcon} />

                <p className={styles.carCharacterText}>{car.doors}</p>
              </div>

              <div className={styles.carCharacterBlockIconAndText}>
                <BsFillPersonFill className={styles.carCharacterIcon} />

                <p className={styles.carCharacterText}>{car.seats}</p>
              </div>
            </div>
          </div>

          {/* --------------------------------------- */}
          {/* RIGHT SIDE */}
          {/* --------------------------------------- */}

          <div className={styles.carRulesBlock}>
            <div className={styles.carRulesMainBlockIconAndText}>
              {/* INSURANCE */}

              <div className={styles.carRulesBlockIconAndText}>
                <BsCarFrontFill className={styles.carRulesIcon} />

                <div className={styles.carRulesBlockText}>
                  <p className={styles.carRulesText}>{t('cars.carCard.insurance.title')}</p>

                  <p className={styles.carRulesTextGrey}>
                    {t('cars.carCard.insurance.description')}
                  </p>
                </div>
              </div>

              {/* FUEL */}

              <div className={styles.carRulesBlockIconAndText}>
                <BsFillBeakerFill className={styles.carRulesIcon} />

                <div className={styles.carRulesBlockText}>
                  <p className={styles.carRulesText}>{t('cars.carCard.fuel.title')}</p>

                  <p className={styles.carRulesTextGrey}>{t('cars.carCard.fuel.description')}</p>
                </div>
              </div>

              {/* SECOND DRIVER */}

              <div className={styles.carRulesBlockIconAndText}>
                <BsFillPeopleFill className={styles.carRulesIcon} />

                <div className={styles.carRulesBlockText}>
                  <p className={styles.carRulesText}>{t('cars.carCard.secondDriver.title')}</p>

                  <p className={styles.carRulesTextGrey}>
                    {t('cars.carCard.secondDriver.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* --------------------------------------- */}
            {/* PRICE + BOOK */}
            {/* --------------------------------------- */}

            <div className={styles.carTotalPriceAndButton}>
              <div className={styles.carTotalPriceBlock}>
                <p className={styles.carTotalPriceText}>{t('cars.carCard.total')}</p>

                <p className={styles.carTotalPriceTextCost}>
                  {rentalPrice.totalPrice} €{' '}
                  {rentalPrice.totalPrice === car.price_per_day && (
                    <span>/ {t('cars.carCard.perDay')}</span>
                  )}
                </p>
              </div>

              <div className={styles.bookColumn}>
                <button
                  type='button'
                  disabled={!canBook}
                  className={styles.buttonBook}
                  onClick={handleBook}>
                  {isAvailable ? t('cars.carCard.book') : getStatusText(car.availability)}
                </button>

                {isAvailable && !hasSearchDates && (
                  <p className={styles.selectDatesWarning}>
                    {t('cars.carCard.selectDatesWarning')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------- */}
      {/* TECHNICAL DATA MODAL */}
      {/* --------------------------------------- */}

      <TechnicalDataModal
        car={car}
        isOpen={isTechnicalDataOpen}
        onClose={() => setIsTechnicalDataOpen(false)}
        canBook={canBook}
        isAvailable={isAvailable}
        hasSearchDates={hasSearchDates}
        availability={car.availability}
        onBook={handleBookFromModal}
        lang={lang}
      />

      {/* --------------------------------------- */}
      {/* REGISTER POPUP */}
      {/* --------------------------------------- */}

      <RegisterPopup
        lang={lang}
        isOpen={isRegisterPopupOpen}
        onClose={() => setIsRegisterPopupOpen(false)}
      />
    </div>
  );
}
