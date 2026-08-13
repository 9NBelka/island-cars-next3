import { BsClock, BsTelephone, BsEnvelope, BsGeoAlt } from 'react-icons/bs';
import { getT } from '../../i18n/getT';
import type { Lang } from '../../i18n/types';
import styles from './Contacts.module.scss';

type ContactsProps = {
  lang: Lang;
};

export default function Contacts({ lang }: ContactsProps) {
  const t = getT(lang);

  return (
    <section className={styles.contacts}>
      <div className={styles.container}>
        <div className={styles.twoColumns}>
          {/* Left column — info */}
          <div className={styles.info}>
            <p className={styles.label}>{t('contacts.label')}</p>

            <h1 className={styles.title}>
              {t('contacts.title')}{' '}
              <span className={styles.accent}>{t('contacts.titleAccent')}</span>
            </h1>

            <p className={styles.subtitle}>{t('contacts.subtitle')}</p>

            {/* Phones */}
            <div className={styles.mainRow}>
              <a href='tel:+34632230891' className={styles.contactCard}>
                <span className={styles.iconCircle}>
                  <BsTelephone className={styles.icon} />
                </span>
                <p className={styles.phoneText}>{t('contacts.phone1')}</p>
              </a>

              <a href='tel:+34632230891' className={styles.contactCard}>
                <span className={styles.iconCircle}>
                  <BsTelephone className={styles.icon} />
                </span>
                <p className={styles.phoneText}>{t('contacts.phone2')}</p>
              </a>

              <a href='mailto:rentcar@islandcars.es' className={styles.contactCard}>
                <span className={styles.iconCircle}>
                  <BsEnvelope className={styles.icon} />
                </span>
                <p>{t('contacts.email')}</p>
              </a>
              <a href='https://maps.app.goo.gl/1usXHc51VUYrKCYy7'>
                <div className={styles.contactCard}>
                  <span className={styles.iconCircle}>
                    <BsGeoAlt className={styles.icon} />
                  </span>
                  <div className={styles.addressText}>
                    <p>{t('contacts.address')}</p>
                    <p>{t('contacts.addressCity')}</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Working hours */}
            <div className={styles.workingHours}>
              <p className={styles.workingLabel}>{t('contacts.workingHoursLabel')}</p>
              <div className={styles.hoursCard}>
                <span className={styles.iconCircleDark}>
                  <BsClock className={styles.iconTime} />
                </span>
                <div>
                  <p className={styles.days}>{t('contacts.workingHoursDays')}</p>
                  <p className={styles.time}>{t('contacts.workingHoursTime')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — map */}
          <div className={styles.mapWrapper}>
            <iframe
              className={styles.map}
              title='Island Cars location'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3140.2641088784526!2d-0.7318937!3d38.0875158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd63afefbf276c17%3A0x202de88cf3983698!2sIsland%20Cars!5e0!3m2!1sru!2ses!4v1785852083343!5m2!1sru!2ses'
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
