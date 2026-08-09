'use client';

import { useState } from 'react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import {
  BsEnvelopeFill,
  BsPersonFill,
  BsTelephoneFill,
  BsHouseDoorFill,
  BsBuildingFill,
  BsFlagFill,
  BsCardChecklist,
  BsFileEarmarkTextFill,
  BsFillPostcardFill,
} from 'react-icons/bs';

import type { Lang } from '@/app/i18n/types';
import type { Profile as ProfileType } from '@/app/types/profile';
import { getT } from '@/app/i18n/getT';
import { updateProfile } from '@/app/services/auth';

import FormField from '@/app/components/Auth/FormField/FormField';
import AuthSelect from '@/app/components/Auth/AuthSelect/AuthSelect';
import AuthDatePicker from '@/app/components/Auth/AuthDatePicker/AuthDatePicker';
import fieldStyles from '@/app/components/Auth/FormField/FormField.module.scss';

import { buildProfileSchema } from './validationSchema';
import styles from './ProfileInfo.module.scss';
import clsx from 'clsx';

type Props = {
  lang: Lang;
  profile: ProfileType | null;
  user: User;
};

type FormValues = {
  first_name: string;
  last_name: string;
  document_number: string;
  phone: string;
  document_type: string;
  license_number: string;
  date_of_birth: string;
  country: string;
  city: string;
  address: string;
};

function toInitialValues(profile: ProfileType | null): FormValues {
  return {
    first_name: profile?.first_name ?? '',
    last_name: profile?.last_name ?? '',
    document_number: profile?.document_number ?? '',
    phone: profile?.phone ?? '',
    document_type: profile?.document_type ?? 'NIE',
    license_number: profile?.license_number ?? '',
    date_of_birth: profile?.date_of_birth ?? '',
    country: profile?.country ?? '',
    city: profile?.city ?? '',
    address: profile?.address ?? '',
  };
}

export default function ProfileInfo({ lang, profile, user }: Props) {
  const t = getT(lang);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const documentTypeOptions = [
    { value: 'NIE', label: t('auth.register.documentTypes.nie') },
    { value: 'DNI', label: t('auth.register.documentTypes.dni') },
    { value: 'Passport', label: t('auth.register.documentTypes.passport') },
    { value: 'NIF', label: t('auth.register.documentTypes.nif') },
    { value: 'Other', label: t('auth.register.documentTypes.other') },
  ];

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>{t('profile.personalData.title')}</h2>
          <p>{t('profile.personalData.subtitle')}</p>
        </div>
      </div>

      <Formik
        initialValues={toInitialValues(profile)}
        enableReinitialize
        validationSchema={buildProfileSchema(t)}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          setSuccess(null);

          try {
            await updateProfile(user.id, {
              firstName: values.first_name,
              lastName: values.last_name,
              phone: values.phone,
              dateOfBirth: values.date_of_birth || undefined,
              country: values.country,
              city: values.city,
              address: values.address,
              licenseNumber: values.license_number,
              documentType: values.document_type,
              documentNumber: values.document_number,
            });

            setSuccess(t('profile.personalData.saveSuccess'));
            router.refresh();
          } catch {
            setError(t('profile.personalData.saveError'));
          } finally {
            setSubmitting(false);
          }
        }}>
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.row4}>
              <FormField
                name='first_name'
                label={t('profile.personalData.name')}
                icon={BsPersonFill}
                placeholder={t('profile.personalData.namePlaceholder')}
              />
              <FormField
                name='last_name'
                label={t('profile.personalData.lastName')}
                icon={BsPersonFill}
                placeholder={t('profile.personalData.lastNamePlaceholder')}
              />
              <div className={fieldStyles.field}>
                <div className={fieldStyles.labelRow}>
                  <label className={fieldStyles.label}>
                    <BsEnvelopeFill className={fieldStyles.labelIcon} />
                    {t('profile.personalData.email')}
                  </label>
                </div>

                <input
                  type='email'
                  value={user.email ?? ''}
                  readOnly
                  className={`${fieldStyles.input} ${styles.readOnly}`}
                  title={t('profile.personalData.emailReadonlyTitle')}
                />
              </div>
              <FormField
                name='phone'
                label={t('profile.personalData.phone')}
                icon={BsTelephoneFill}
                placeholder={t('profile.personalData.phonePlaceholder')}
              />
            </div>

            <div className={styles.row4}>
              <AuthDatePicker
                name='date_of_birth'
                label={t('profile.personalData.birthDate')}
                lang={lang}
              />

              <AuthSelect
                name='document_type'
                label={t('profile.personalData.documentType')}
                icon={BsFileEarmarkTextFill}
                options={documentTypeOptions}
                placeholder={t('profile.personalData.documentTypePlaceholder')}
              />

              <FormField
                name='document_number'
                label={t('profile.personalData.documentNumber')}
                icon={BsFillPostcardFill}
                placeholder={t('profile.personalData.documentNumberPlaceholder')}
              />

              <FormField
                name='license_number'
                label={t('profile.personalData.licenseNumber')}
                icon={BsCardChecklist}
                placeholder={t('profile.personalData.licenseNumberPlaceholder')}
              />
            </div>

            <div className={styles.divider} />

            <div className={styles.row3}>
              <FormField
                name='country'
                label={t('profile.personalData.country')}
                icon={BsFlagFill}
                placeholder={t('profile.personalData.countryPlaceholder')}
              />
              <FormField
                name='city'
                label={t('profile.personalData.city')}
                icon={BsBuildingFill}
                placeholder={t('profile.personalData.cityPlaceholder')}
              />
              <FormField
                name='address'
                label={t('profile.personalData.address')}
                icon={BsHouseDoorFill}
                placeholder={t('profile.personalData.addressPlaceholder')}
              />
            </div>

            <div>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
              <button
                type='submit'
                className={clsx(styles.saveButton, (error || success) && styles.marg)}
                disabled={isSubmitting}>
                {isSubmitting
                  ? t('profile.personalData.saving')
                  : t('profile.personalData.saveButton')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
