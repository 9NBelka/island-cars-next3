import type { Car } from './car';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'paid' | 'unpaid';
export type PaymentMethod = 'cash' | 'card_full' | 'card_deposit';

export type Booking = {
  id: string;
  car_id: string;
  user_id: string;

  pickup_place: string;
  return_place: string;

  start_at: string;
  end_at: string;

  total_price: number;

  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;

  notes: string | null;

  created_at: string;
  updated_at: string;

  car: Car;
};
