import clsx from 'clsx';

import styles from './CarCard.module.scss';

import type { Car } from '@/app/types/car';
import type { CarAvailability } from '@/app/types/carAvailability';
import {
  BsCarFrontFill,
  BsFillBeakerFill,
  BsFillFuelPumpFill,
  BsFillPeopleFill,
  BsFillPersonFill,
  BsFillSuitcaseLgFill,
} from 'react-icons/bs';
import { TbCarDoor } from 'react-icons/tb';

type CarWithAvailability = Car & {
  availability: CarAvailability;
};

type CarCardProps = {
  car: CarWithAvailability;
};

const STATUS_TEXT: Record<CarAvailability, string> = {
  available: 'Available',

  booked: 'Booked',

  reserved: 'Reserved',

  rented: 'Rented',

  maintenance: 'Maintenance',

  inactive: 'Inactive',
};

export default function CarCard({ car }: CarCardProps) {
  const isAvailable = car.availability === 'available';

  return (
    <div className={clsx(styles.card, styles[car.availability])}>
      <div className={styles.cardBlockLeftRight}>
        <div className={styles.carCharacterBlockAndHeader}>
          <div className={styles.cardHeader}>
            <h2 className={styles.carName}>
              {car.brand} {car.model}
            </h2>
            <p className={styles.transmissionText}>{car.transmission} Transmission1</p>
          </div>

          <div className={styles.carShadow}>
            <img src='/images/citroen-spacetourer.png'></img>
          </div>

          <div className={styles.carCharacterBlock}>
            <div className={styles.carCharacterBlockIconAndText}>
              <BsFillFuelPumpFill className={styles.carCharacterIcon} />
              <p className={styles.carCharacterText}>{car.fuel_type}</p>
            </div>
            <div className={styles.carCharacterBlockIconAndText}>
              <BsFillSuitcaseLgFill className={styles.carCharacterIcon} />
              <p className={styles.carCharacterText}>{car.seats}</p>
            </div>
            <div className={styles.carCharacterBlockIconAndText}>
              <TbCarDoor className={styles.carCharacterIcon} />
              <p className={styles.carCharacterText}>{car.doors}</p>
            </div>
            <div className={styles.carCharacterBlockIconAndText}>
              <BsFillPersonFill className={styles.carCharacterIcon} />
              <p className={styles.carCharacterText}>{car.luggage}</p>
            </div>
          </div>
        </div>
        <div className={styles.carRulesBlock}>
          <div className={styles.carRulesMainBlockIconAndText}>
            <div className={styles.carRulesBlockIconAndText}>
              <BsCarFrontFill className={styles.carRulesIcon} />
              <div className={styles.carRulesBlockText}>
                <p className={styles.carRulesText}>{`"Full Cover" insurance`}</p>
                <p className={styles.carRulesTextGrey}>Full cover insurance covers the vehicle.</p>
              </div>
            </div>
            <div className={styles.carRulesBlockIconAndText}>
              <BsFillBeakerFill className={styles.carRulesIcon} />
              <div className={styles.carRulesBlockText}>
                <p className={styles.carRulesText}>Full-full fuel tank</p>
                <p className={styles.carRulesTextGrey}>Get a vehicle with full tank of fuel.</p>
              </div>
            </div>
            <div className={styles.carRulesBlockIconAndText}>
              <BsFillPeopleFill className={styles.carRulesIcon} />
              <div className={styles.carRulesBlockText}>
                <p className={styles.carRulesText}>Second driver</p>
                <p className={styles.carRulesTextGrey}>Add free second driver.</p>
              </div>
            </div>
          </div>
          <div className={styles.carTotalPriceAndButton}>
            <div className={styles.carTotalPriceBlock}>
              <p className={styles.carTotalPriceText}>Total</p>
              <p className={styles.carTotalPriceTextCost}>
                {car.price_per_day} € <span>/ day</span>
              </p>
            </div>
            <div>
              <button disabled={!isAvailable} className={styles.buttonBook}>
                {isAvailable ? 'Book' : STATUS_TEXT[car.availability]}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <p>{STATUS_TEXT[car.availability]}</p> */}
    </div>
  );
}
