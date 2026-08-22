export type RentalRate = {
  minDays: number;
  maxDays: number;
  discount: number;
};

export const RENTAL_RATES = [
  {
    minDays: 1,
    maxDays: 2,
    discountPercent: 0,
  },
  {
    minDays: 3,
    maxDays: 6,
    discountPercent: 11.11,
  },
  {
    minDays: 7,
    maxDays: 29,
    discountPercent: 22.22,
  },
  {
    minDays: 30,
    maxDays: Infinity,
    discountPercent: 30,
  },
];
