import { supabase } from '../lib/supabase';
import type { Booking } from '../types/booking';

export type PaymentMethod = 'cash' | 'card_full' | 'card_deposit';

export type CreateBookingParams = {
  carId: string;
  pickupPlace: string;
  returnPlace: string;
  startAt: string;
  endAt: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
};

export async function createBooking(params: CreateBookingParams) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      car_id: params.carId,
      user_id: user.id,
      pickup_place: params.pickupPlace,
      return_place: params.returnPlace,
      start_at: params.startAt,
      end_at: params.endAt,
      total_price: params.totalPrice,
      payment_method: params.paymentMethod,
    })
    .select('*, car:cars(*)')
    .single();

  if (error) throw error;

  // Уведомляем n8n асинхронно — не блокируем и не ломаем UX бронирования,
  // если вебхук временно недоступен или отвечает с ошибкой.
  fetch('/api/booking-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId: data.id }),
  }).catch((err) => {
    console.error('Failed to notify booking webhook:', err);
  });

  return data as Booking;
}

export async function getMyBookings(): Promise<Booking[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*, car:cars(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as Booking[];
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select('*, car:cars(*)')
    .single();

  if (error) throw error;

  return data as Booking;
}
