import { supabase } from '../lib/supabase';

import type { Car } from '../types/car';
import type { SearchCarsParams } from '../types/search';
import type { CarAvailability } from '../types/carAvailability';

export async function searchCars(
  params: SearchCarsParams,
): Promise<(Car & { availability: CarAvailability })[]> {
  //---------------------------------------
  // Машины
  //---------------------------------------

  const { data: cars, error: carsError } = await supabase
    .from('cars')
    .select('*')
    .eq('is_visible', true)
    .order('brand');

  if (carsError) throw carsError;

  //---------------------------------------
  // Брони
  //---------------------------------------

  const { data: bookings, error: bookingsError } = await supabase
    .from('public_booking_windows')
    .select('car_id')
    .lt('start_at', params.endAt)
    .gt('end_at', params.startAt);

  if (bookingsError) throw bookingsError;

  const busyCars = new Set(bookings?.map((b) => b.car_id));

  //---------------------------------------
  // Формируем ответ
  //---------------------------------------

  return (cars ?? []).map((car) => {
    let availability: CarAvailability;

    if (busyCars.has(car.id)) {
      availability = 'booked';
    } else {
      availability = car.status as CarAvailability;
    }

    return {
      ...car,
      availability,
    };
  });
}
