'use client';

import { Formik, Form } from 'formik';
import {
  BsPersonFill,
  BsEnvelopeFill,
  BsTelephoneFill,
  BsFlagFill,
  BsBuildingFill,
  BsHouseDoorFill,
  BsCardChecklist,
  BsFileEarmarkTextFill,
  BsFillPostcardFill,
  BsGlobe,
  BsLockFill,
} from 'react-icons/bs';
import { getT } from '../../../i18n/getT';
import type { Lang } from '../../../i18n/types';
import LangLink from '../../LangLink/LangLink';
import FormField from '../FormField/FormField';
import {
  buildRegisterSchema,
  registerInitialValues,
  type RegisterValues,
} from './validationSchema';
import styles from './RegisterForm.module.scss';
import AuthDatePicker from '../AuthDatePicker/AuthDatePicker';
import AuthSelect from '../AuthSelect/AuthSelect';
import { register } from '@/app/services/auth';
import { useState } from 'react';
import type { FormikHelpers } from 'formik';

type RegisterFormProps = { lang: Lang };

export default function RegisterForm({ lang }: RegisterFormProps) {
  const t = getT(lang);
  const schema = buildRegisterSchema(t);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'ru', label: 'Русский' },
    { value: 'uk', label: 'Українська' },
  ];

  const documentTypeOptions = [
    { value: 'international_passport', label: 'Заграничный паспорт' },
    { value: 'dni', label: t('auth.register.documentTypes.dni') },
    { value: 'passport', label: t('auth.register.documentTypes.passport') },
    { value: 'nie', label: t('auth.register.documentTypes.nie') },
  ];

  const handleSubmit = async (
    values: RegisterValues,
    { resetForm, setSubmitting }: FormikHelpers<RegisterValues>,
  ) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await register(values);

      setSuccessMessage(
        'Аккаунт успешно создан. Проверьте электронную почту для подтверждения регистрации.',
      );

      resetForm();
    } catch (error: any) {
      console.error(error);

      switch (error.message) {
        case 'User already registered':
          setErrorMessage('Пользователь с таким Email уже зарегистрирован.');
          break;

        case 'Password should be at least 6 characters':
          setErrorMessage('Пароль должен содержать минимум 6 символов.');
          break;

        default:
          setErrorMessage(error.message ?? 'Произошла ошибка регистрации.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.mainBlock}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('auth.register.title')}</h1>
        <p className={styles.subtitle}>{t('auth.register.subtitle')}</p>

        <Formik
          initialValues={registerInitialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.row}>
                <FormField
                  name='firstName'
                  label={t('auth.register.firstName')}
                  icon={BsPersonFill}
                  placeholder={t('auth.register.firstNamePlaceholder')}
                />
                <FormField
                  name='lastName'
                  label={t('auth.register.lastName')}
                  icon={BsPersonFill}
                  placeholder={t('auth.register.lastNamePlaceholder')}
                />
                <FormField
                  name='email'
                  label={t('auth.register.email')}
                  icon={BsEnvelopeFill}
                  type='email'
                  placeholder={t('auth.register.emailPlaceholder')}
                />

                <FormField
                  name='phone'
                  label={t('auth.register.phone')}
                  icon={BsTelephoneFill}
                  type='tel'
                  placeholder={t('auth.register.phonePlaceholder')}
                  hint={t('auth.register.phoneHint')}
                />
                <AuthDatePicker
                  name='dateOfBirth'
                  label={t('auth.register.dateOfBirth')}
                  lang={lang}
                />
                <AuthSelect
                  name='language'
                  label={t('auth.register.language')}
                  icon={BsGlobe}
                  options={languageOptions}
                  placeholder={t('auth.register.language')}
                />

                <FormField
                  name='country'
                  label={t('auth.register.country')}
                  icon={BsFlagFill}
                  placeholder={t('auth.register.countryPlaceholder')}
                />
                <FormField
                  name='city'
                  label={t('auth.register.city')}
                  icon={BsBuildingFill}
                  placeholder={t('auth.register.cityPlaceholder')}
                />
                <FormField
                  name='address'
                  label={t('auth.register.address')}
                  icon={BsHouseDoorFill}
                  placeholder={t('auth.register.addressPlaceholder')}
                />

                {/* <FormField
                name='postalCode'
                label={t('auth.register.postalCode')}
                icon={BsMailbox2Flag}
                placeholder={t('auth.register.postalCodePlaceholder')}
              /> */}
                <FormField
                  name='licenseNumber'
                  label={t('auth.register.licenseNumber')}
                  icon={BsCardChecklist}
                  placeholder={t('auth.register.licenseNumberPlaceholder')}
                />
                <AuthSelect
                  name='documentType'
                  label={t('auth.register.documentType')}
                  icon={BsFileEarmarkTextFill}
                  options={documentTypeOptions}
                  placeholder={t('auth.register.documentTypePlaceholder')}
                />
                <FormField
                  name='documentNumber'
                  label={t('auth.register.documentNumber')}
                  icon={BsFillPostcardFill}
                  placeholder={t('auth.register.documentNumberPlaceholder')}
                />
              </div>
              <div className={styles.row}>
                <FormField
                  name='password'
                  label={t('auth.register.password')}
                  icon={BsLockFill}
                  type='password'
                  placeholder={t('auth.register.passwordPlaceholder')}
                />
                <FormField
                  name='confirmPassword'
                  label={t('auth.register.confirmPassword')}
                  icon={BsLockFill}
                  type='password'
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                />
              </div>

              <div className={styles.submitBlock}>
                <button
                  type='submit'
                  aria-label='Register'
                  className={`${styles.submit} ${isSubmitting ? styles.loading : ''}`}
                  disabled={isSubmitting || !!successMessage}>
                  {isSubmitting ? 'Creating account...' : t('auth.register.submit')}
                </button>
              </div>

              {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

              {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

              <p className={styles.footerLink}>
                {t('auth.register.haveAccount')}{' '}
                <LangLink lang={lang} href='/login'>
                  {t('auth.register.logIn')}
                </LangLink>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
