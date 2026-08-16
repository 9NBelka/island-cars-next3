import { BsFillTelephoneFill, BsShieldFillCheck, BsClockFill, BsTagFill } from 'react-icons/bs';
import type { IconType } from 'react-icons';

import { getT } from '../../i18n/getT';
import type { Lang } from '../../i18n/types';

import SearchForm from '../SearchForm/SearchForm';
import Stats from '../Stats/Stats';

import styles from './Hero.module.scss';

import type { SearchCarsParams } from '@/app/types/search';
import type { SearchFormState } from '@/app/types/searchForm';
import clsx from 'clsx';

type HeroProps = {
  lang: Lang;

  form: SearchFormState;

  onFormChange: (form: SearchFormState) => void;

  onSearch: (params: SearchCarsParams) => void;
};

type Feature = {
  icon: IconType;
  text: string;
};

console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));

export default function Hero({ lang, form, onFormChange, onSearch }: HeroProps) {
  const t = getT(lang);

  const features: Feature[] = [
    {
      icon: BsShieldFillCheck,
      text: t('hero.features.insurance'),
    },
    {
      icon: BsClockFill,
      text: t('hero.features.pickup'),
    },
    {
      icon: BsTagFill,
      text: t('hero.features.price'),
    },
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.overlay} />
        <a href='tel:+34656369589'>
          <div className={styles.contactBox}>
            <div className={styles.iconPhoneBlock}>
              <BsFillTelephoneFill className={styles.iconPhone} />
            </div>

            <div className={styles.contactTextBlock}>
              <p className={styles.contactLabel}>{t('hero.contactUs')}</p>

              <p className={styles.contactPhone}>+34 656 369 589</p>
            </div>
          </div>
        </a>

        <div className={styles.content}>
          <a className={styles.contactBoxLink} href='tel:+34656369589'>
            <div className={clsx(styles.contactBox, styles.contactBoxPhone)}>
              <div className={styles.contactTextBlock}>
                <p className={styles.contactLabel}>{t('hero.contactUs')}:</p>

                <p className={styles.contactPhone}>+34 656 369 589</p>
              </div>
            </div>
          </a>
          <h1 className={styles.title}>
            {t('hero.titleLine1')}
            <br />
            {t('hero.titleLine2')} <span className={styles.accent}>{t('hero.titleAccent')}</span>
          </h1>

          <p className={styles.subtitle}>
            {t('hero.subtitle1')}
            <br />
            {t('hero.subtitle2')}
          </p>

          <ul className={styles.features}>
            {features.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon className={styles.featureIcon} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.formWrapper}>
          <SearchForm lang={lang} form={form} onChange={onFormChange} onSearch={onSearch} />
        </div>
      </div>

      <div className={styles.statsWrapper}>
        <Stats lang={lang} />
      </div>
    </section>
  );
}
