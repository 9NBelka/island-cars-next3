import { getPendingBooking, clearPendingBooking } from '@/app/utils/pendingBooking';
import { createBooking } from '@/app/services/bookings';

const PROCESSING_KEY = 'pending_booking_processing';

export async function processPendingBooking(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  const pendingBooking = getPendingBooking();

  if (!pendingBooking) {
    return false;
  }

  // Защита от двойного создания
  if (sessionStorage.getItem(PROCESSING_KEY) === 'true') {
    return false;
  }

  sessionStorage.setItem(PROCESSING_KEY, 'true');

  try {
    console.log('📦 Creating pending booking:', pendingBooking);

    await createBooking({
      carId: pendingBooking.carId,
      pickupPlace: pendingBooking.pickupPlace,
      returnPlace: pendingBooking.returnPlace,
      startAt: pendingBooking.startAt,
      endAt: pendingBooking.endAt,
      totalPrice: pendingBooking.totalPrice,
      paymentMethod: pendingBooking.paymentMethod,
    });

    console.log('✅ Pending booking created');

    clearPendingBooking();

    return true;
  } catch (error) {
    console.error('❌ Failed to create pending booking:', error);

    // Не удаляем pending_booking,
    // чтобы пользователь не потерял бронь.
    return false;
  } finally {
    sessionStorage.removeItem(PROCESSING_KEY);
  }
}
