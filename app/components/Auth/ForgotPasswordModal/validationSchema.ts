import * as Yup from 'yup';
import type { TFunction } from '@/app/i18n/getT';

export function buildForgotPasswordSchema(t: TFunction) {
  return Yup.object({
    email: Yup.string().email(t('auth.errors.invalidEmail')).required(t('auth.errors.required')),
  });
}

export type ForgotPasswordValues = {
  email: string;
};

export const forgotPasswordInitialValues: ForgotPasswordValues = {
  email: '',
};
