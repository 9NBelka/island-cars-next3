export type Car = {
  id: string;

  brand: string;
  model: string;
  year: number;

  transmission: string;

  fuel_type: string;

  seats: number;

  luggage: number;

  doors: number;

  status: 'available' | 'reserved' | 'rented' | 'maintenance' | 'inactive';

  price_per_day: number;

  image_preview: string | null;
};
