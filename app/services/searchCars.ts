import { supabase } from '../lib/supabase';

import type { Car, CarImage } from '../types/car';
import type { SearchCarsParams } from '../types/search';
import type { CarAvailability } from '../types/carAvailability';

const CAR_IMAGES_BUCKET = 'cars';

type CarWithImages = Car & { images: CarImage[] };

export async function searchCars(
  params: SearchCarsParams,
): Promise<(CarWithImages & { availability: CarAvailability })[]> {
  //---------------------------------------
  // Машины + фотографии
  //---------------------------------------

  const { data: cars, error: carsError } = await supabase
    .from('cars')
    .select(
      `
      *,
      images:car_images (
        id,
        car_id,
        image_url,
        sort_order,
        is_preview,
        created_at
      )
    `,
    )
    .eq('is_visible', true)
    .order('brand')
    .returns<CarWithImages[]>();

  if (carsError) {
    console.error('Error loading cars:', carsError);
    throw carsError;
  }

  //---------------------------------------
  // Брони
  //---------------------------------------

  const { data: bookings, error: bookingsError } = await supabase
    .from('public_booking_windows')
    .select('car_id')
    .lt('start_at', params.endAt)
    .gt('end_at', params.startAt);

  if (bookingsError) {
    console.error('Error loading bookings:', bookingsError);
    throw bookingsError;
  }

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

    //---------------------------------------
    // Формируем публичные URL фотографий
    //---------------------------------------

    const images = (car.images ?? [])
      .slice()
      .sort((a: CarImage, b: CarImage) => a.sort_order - b.sort_order)
      .map((image: CarImage) => ({
        ...image,
        image_url: supabase.storage.from(CAR_IMAGES_BUCKET).getPublicUrl(image.image_url).data
          .publicUrl,
      }));

    const cardImageUrl = car.card_image
      ? supabase.storage.from(CAR_IMAGES_BUCKET).getPublicUrl(car.card_image).data.publicUrl
      : null;

    return {
      ...car,
      images,
      card_image: cardImageUrl,
      availability,
    };
  });
}
