const STORAGE_KEY = 'pending_booking';

export type PendingBooking = {
  carId: string;
  pickupPlace: string;
  returnPlace: string;
  startAt: string;
  endAt: string;
  totalPrice: number;
  paymentMethod: 'cash' | 'card_full' | 'card_deposit';
};

export function savePendingBooking(booking: PendingBooking) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
}

export function getPendingBooking(): PendingBooking | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingBooking;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearPendingBooking() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY);
}
