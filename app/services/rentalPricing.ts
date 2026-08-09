import { RENTAL_RATES } from '../constants/pricing';

export function getRentalDays(startAt: string, endAt: string): number {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const difference = end.getTime() - start.getTime();

  if (difference <= 0) {
    return 1;
  }

  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return Math.max(1, days);
}

export function getRentalDiscount(days: number): number {
  const rate = RENTAL_RATES.find((item) => days >= item.minDays && days <= item.maxDays);

  return rate?.discountPercent ?? 0;
}

export function calculateRentalPrice(basePricePerDay: number, startAt: string, endAt: string) {
  const days = getRentalDays(startAt, endAt);

  const discountPercent = getRentalDiscount(days);

  const pricePerDay = basePricePerDay * (1 - discountPercent / 100);

  const totalPrice = pricePerDay * days;

  return {
    days,
    discountPercent,
    pricePerDay: Number(pricePerDay.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
  };
}
