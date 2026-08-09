import * as Yup from 'yup';
import type { TFunction } from '@/app/i18n/getT';

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-žÑñ\s'-]+$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;
const ALPHANUMERIC_REGEX = /^[A-Za-z0-9\s-]{4,30}$/;

export function buildProfileSchema(t: TFunction) {
  return Yup.object({
    first_name: Yup.string()
      .matches(NAME_REGEX, t('auth.errors.onlyLetters'))
      .required(t('auth.errors.required')),
    last_name: Yup.string()
      .matches(NAME_REGEX, t('auth.errors.onlyLetters'))
      .required(t('auth.errors.required')),
    phone: Yup.string()
      .matches(PHONE_REGEX, t('auth.errors.invalidPhone'))
      .required(t('auth.errors.required')),
    date_of_birth: Yup.date()
      .typeError(t('auth.errors.invalidDate'))
      .required(t('auth.errors.required'))
      .test('is-adult', t('auth.errors.underage'), (value) => {
        if (!value) return false;
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 18);
        return value <= cutoff;
      }),
    country: Yup.string()
      .matches(NAME_REGEX, t('auth.errors.onlyLetters'))
      .required(t('auth.errors.required')),
    city: Yup.string()
      .matches(NAME_REGEX, t('auth.errors.onlyLetters'))
      .required(t('auth.errors.required')),
    address: Yup.string().required(t('auth.errors.required')),
    license_number: Yup.string()
      .matches(ALPHANUMERIC_REGEX, t('auth.errors.invalidDocument'))
      .required(t('auth.errors.required')),
    document_type: Yup.string().required(t('auth.errors.required')),
    document_number: Yup.string()
      .matches(ALPHANUMERIC_REGEX, t('auth.errors.invalidDocument'))
      .required(t('auth.errors.required')),
  });
}
