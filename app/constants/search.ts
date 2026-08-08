import type { SearchFormState } from '../types/searchForm';

export const DEFAULT_FORM: SearchFormState = {
  fromPlace: 'airport',
  toPlace: 'airport',

  fromDate: '',
  fromTime: '14:30',

  toDate: '',
  toTime: '14:30',
};
