import * as Yup from 'yup';
import type { TFunction } from '@/app/i18n/getT';

export function buildResetPasswordSchema(t: TFunction) {
  return Yup.object({
    password: Yup.string()
      .min(8, t('auth.errors.passwordMinLength'))
      .matches(/[0-9]/, t('auth.errors.passwordDigit'))
      .required(t('auth.errors.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('auth.errors.passwordMatch'))
      .required(t('auth.errors.required')),
  });
}

export type ResetPasswordValues = {
  password: string;
  confirmPassword: string;
};

export const resetPasswordInitialValues: ResetPasswordValues = {
  password: '',
  confirmPassword: '',
};
