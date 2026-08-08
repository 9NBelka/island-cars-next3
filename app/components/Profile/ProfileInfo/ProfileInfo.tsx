'use client';

import type { Lang } from '@/app/i18n/types';
import type { Profile as ProfileType } from '@/app/types/profile';

import styles from './ProfileInfo.module.scss';

type Props = {
  lang: Lang;
  profile: ProfileType | null;
};

type InfoItemProps = {
  label: string;
  value?: string | null;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}</span>

      <span className={styles.value}>{value?.trim() ? value : '—'}</span>
    </div>
  );
}

export default function ProfileInfo({ profile }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>Personal Information</h2>
      </div>

      <div className={styles.grid}>
        <InfoItem label='First Name' value={profile?.first_name} />

        <InfoItem label='Last Name' value={profile?.last_name} />

        <InfoItem label='Phone' value={profile?.phone} />

        <InfoItem label='Date of Birth' value={profile?.date_of_birth} />

        <InfoItem label='Country' value={profile?.country} />

        <InfoItem label='City' value={profile?.city} />

        <InfoItem label='Address' value={profile?.address} />

        <InfoItem label='Language' value={profile?.language} />

        <InfoItem label='Driver License' value={profile?.license_number} />

        <InfoItem label='Document Type' value={profile?.document_type} />

        <InfoItem label='Document Number' value={profile?.document_number} />
      </div>
    </section>
  );
}
