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

  // Защита от двойного создания брони.
  // Особенно важно в development из-за React Strict Mode.
  if (sessionStorage.getItem(PROCESSING_KEY) === 'true') {
    return false;
  }

  sessionStorage.setItem(PROCESSING_KEY, 'true');

  try {
    await createBooking({
      carId: pendingBooking.carId,
      pickupPlace: pendingBooking.pickupPlace,
      returnPlace: pendingBooking.returnPlace,
      startAt: pendingBooking.startAt,
      endAt: pendingBooking.endAt,
      totalPrice: pendingBooking.totalPrice,
      paymentMethod: pendingBooking.paymentMethod,
    });

    // Бронь успешно создана — удаляем отложенную.
    clearPendingBooking();

    return true;
  } catch (error) {
    console.error('Failed to create pending booking:', error);

    // Если создание не удалось, оставляем pending_booking,
    // чтобы пользователь не потерял бронь.
    return false;
  } finally {
    sessionStorage.removeItem(PROCESSING_KEY);
  }
}
