'use client';

import CarCard from '../CarCard/CarCard';
import type { Car } from '@/app/types/car';
import type { CarAvailability } from '@/app/types/carAvailability';
import styles from './CarList.module.scss';

type CarListProps = {
  cars: (Car & { availability: CarAvailability })[];
  loading: boolean;
};

export default function CarList({ cars, loading }: CarListProps) {
  if (loading) return <p>Loading...</p>;

  if (!cars.length) return <p>No cars found.</p>;

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.carsList}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
