'use client';

import { useState, type FormEvent } from 'react';
import { BsArrowRightShort } from 'react-icons/bs';

import { getT } from '../../i18n/getT';
import type { Lang } from '../../i18n/types';

import styles from './SearchForm.module.scss';

import CustomSelect from './CustomSelect/CustomSelect';
import DatePicker from './DatePicker/DatePicker';
import TimePicker from './TimePicker/TimePicker';

import type { SearchCarsParams } from '@/app/types/search';
import type { SearchFormState } from '@/app/types/searchForm';

type SearchFormProps = {
  lang: Lang;

  form: SearchFormState;

  onChange: (form: SearchFormState) => void;

  onSearch: (params: SearchCarsParams) => void;
};

// текущее время, округлённое вверх до ближайшего 30-минутного слота
function getRoundedNow() {
  const now = new Date();

  const minutes = now.getMinutes() < 30 ? 30 : 0;
  const hours = now.getMinutes() < 30 ? now.getHours() : now.getHours() + 1;

  return `${String(hours % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function isToday(dateStr: string) {
  if (!dateStr) return false;

  const today = new Date();

  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');

  return dateStr === `${y}-${m}-${d}`;
}

export default function SearchForm({ lang, form, onChange, onSearch }: SearchFormProps) {
  const t = getT(lang);

  const [placeOpen, setPlaceOpen] = useState<'from' | 'to' | null>(null);

  const [pickerOpen, setPickerOpen] = useState<
    'fromDate' | 'fromTime' | 'toDate' | 'toTime' | null
  >(null);

  const places = [
    { value: 'airport', label: t('form.places.airport') },
    { value: 'stationAlic', label: t('form.places.stationAlic') },
    { value: 'station', label: t('form.places.station') },
    { value: 'office', label: t('form.places.office') },
    { value: 'camping', label: t('form.places.camping') },
    { value: 'myLocation', label: t('form.places.myLocation') },
  ];

  const handleSelect = (field: keyof SearchFormState) => (value: string) => {
    onChange({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSearch({
      pickupPlace: form.fromPlace,
      returnPlace: form.toPlace,

      startAt: `${form.fromDate}T${form.fromTime}:00`,
      endAt: `${form.toDate}T${form.toTime}:00`,
    });

    setTimeout(() => {
      document.getElementById('carList')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 175);
  };

  const fromDisabledBefore = isToday(form.fromDate) ? getRoundedNow() : undefined;

  const toMinDate = form.fromDate ? new Date(`${form.fromDate}T00:00:00`) : undefined;

  const toDisabledBefore =
    form.toDate === form.fromDate && isToday(form.toDate) ? getRoundedNow() : undefined;

  const twoDateTime = true;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.selectsBlock}>
        <div className={styles.field}>
          <label>{t('form.fromPlace')}</label>

          <CustomSelect
            isOpen={placeOpen === 'from'}
            setIsOpen={(open) => setPlaceOpen(open ? 'from' : null)}
            value={form.fromPlace}
            onChange={handleSelect('fromPlace')}
            options={places}
            placeholder={t('form.fromPlace')}
          />
        </div>

        <div className={styles.field}>
          <label>{t('form.toPlace')}</label>

          <CustomSelect
            isOpen={placeOpen === 'to'}
            setIsOpen={(open) => setPlaceOpen(open ? 'to' : null)}
            value={form.toPlace}
            onChange={handleSelect('toPlace')}
            options={places}
            placeholder={t('form.toPlace')}
          />
        </div>

        <div className={styles.field}>
          <label>{t('form.fromDate')}</label>

          <div className={styles.dateTime}>
            <DatePicker
              isOpen={pickerOpen === 'fromDate'}
              setIsOpen={(open) => setPickerOpen(open ? 'fromDate' : null)}
              value={form.fromDate}
              onChange={handleSelect('fromDate')}
              lang={lang}
              rangeStart={form.fromDate}
              rangeEnd={form.toDate}
            />

            <TimePicker
              isOpen={pickerOpen === 'fromTime'}
              setIsOpen={(open) => setPickerOpen(open ? 'fromTime' : null)}
              value={form.fromTime}
              onChange={handleSelect('fromTime')}
              disabledBefore={fromDisabledBefore}
              workingLabel={t('form.workingHours')}
              offHoursLabel={t('form.offHours')}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>{t('form.toDate')}</label>

          <div className={styles.dateTime}>
            <DatePicker
              isOpen={pickerOpen === 'toDate'}
              setIsOpen={(open) => setPickerOpen(open ? 'toDate' : null)}
              value={form.toDate}
              onChange={handleSelect('toDate')}
              lang={lang}
              minDate={toMinDate}
              rangeStart={form.fromDate}
              rangeEnd={form.toDate}
            />

            <TimePicker
              isOpen={pickerOpen === 'toTime'}
              setIsOpen={(open) => setPickerOpen(open ? 'toTime' : null)}
              value={form.toTime}
              onChange={handleSelect('toTime')}
              disabledBefore={toDisabledBefore}
              workingLabel={t('form.workingHours')}
              offHoursLabel={t('form.offHours')}
              twoDateTime={twoDateTime}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttonBlock}>
        <button type='submit' className={styles.submit}>
          {t('form.submit')}

          <BsArrowRightShort className={styles.submitIcon} />
        </button>
      </div>
    </form>
  );
}
