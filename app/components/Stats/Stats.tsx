import { BsGeoAltFill, BsCarFrontFill, BsStarFill, BsHeadset } from 'react-icons/bs';
import type { IconType } from 'react-icons';
import { getT } from '../../i18n/getT';
import type { Lang } from '../../i18n/types';
import styles from './Stats.module.scss';

type StatsProps = { lang: Lang };

type StatItem = {
  icon: IconType;
  value: string;
  label: string;
};

export default function Stats({ lang }: StatsProps) {
  const t = getT(lang);

  const items: StatItem[] = [
    { icon: BsGeoAltFill, value: t('stats.locations'), label: t('stats.locationsSub') },
    { icon: BsCarFrontFill, value: t('stats.cars'), label: t('stats.carsSub') },
    { icon: BsStarFill, value: t('stats.rating'), label: t('stats.ratingSub') },
    { icon: BsHeadset, value: t('stats.support'), label: t('stats.supportSub') },
  ];

  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        {items.map(({ icon: Icon, value, label }) => (
          <div className={styles.item} key={value}>
            <div className={styles.iconBox}>
              <Icon className={styles.icon} />
            </div>
            <div className={styles.text}>
              <p className={styles.value}>{value}</p>
              <p className={styles.label}>{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
