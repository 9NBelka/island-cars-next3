export type CarImage = {
  id: string;
  car_id: string;
  image_url: string;
  sort_order: number;
  is_preview: boolean;
  created_at: string;
};

export type Car = {
  id: string;

  brand: string;
  model: string;
  year: number;

  transmission: string;
  fuel_type: string;
  engine_volume: string;

  seats: number;
  luggage: number;
  doors: number;

  status: 'available' | 'reserved' | 'rented' | 'maintenance' | 'inactive';

  price_per_day: number;

  image_preview: string | null;

  fuel_consumption: string | null;
  features: string | null;

  images: CarImage[];

  card_image: string | null;
};
