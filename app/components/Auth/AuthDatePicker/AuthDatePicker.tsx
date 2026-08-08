'use client';

import { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';
import { BsCalendar3, BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs';
import clsx from 'clsx';
import type { Lang } from '../../../i18n/types';
import fieldStyles from '../FormField/FormField.module.scss';
import styles from './AuthDatePicker.module.scss';

type AuthDatePickerProps = {
  name: string;
  label: string;
  lang: Lang;
  minDate?: Date;
  maxDate?: Date;
};

const LOCALE_MAP: Record<Lang, string> = { en: 'en-US', es: 'es-ES' };

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekdayLabels(locale: string) {
  const monday = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
  });
}

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = firstWeekday; i > 0; i--) {
    cells.push({ date: new Date(year, month, 1 - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      inMonth: false,
    });
  }

  return cells;
}

function formatDisplayDate(date: Date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

export default function AuthDatePicker({
  name,
  label,
  lang,
  minDate,
  maxDate,
}: AuthDatePickerProps) {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const locale = LOCALE_MAP[lang];

  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : today; // по умолчанию нельзя выбрать будущее

  const selectedDate = field.value ? new Date(`${field.value}T00:00:00`) : null;
  const [viewDate, setViewDate] = useState(() => selectedDate ?? max);

  useEffect(() => {
    if (!isOpen) return;

    async function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        await helpers.setTouched(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, helpers]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = buildMonthGrid(year, month);
  const weekdays = getWeekdayLabels(locale);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
    viewDate,
  );

  const monthLabels = getMonthLabels(locale);
  const years = getYearRange(min, max);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(year, Number(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(Number(e.target.value), month, 1));
  };

  const handlePick = async (date: Date) => {
    const day = startOfDay(date);
    if (min && day < min) return;
    if (max && day > max) return;
    await helpers.setValue(toDateKey(date));
    helpers.setTouched(true);
    setIsOpen(false);
  };

  function getMonthLabels(locale: string) {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2024, i, 1);
      return new Intl.DateTimeFormat(locale, { month: 'short' }).format(d);
    });
  }

  function getYearRange(min?: Date, max?: Date) {
    const maxYear = max ? max.getFullYear() : new Date().getFullYear();
    const minYear = min ? min.getFullYear() : maxYear - 100; // по умолчанию — 100 лет назад
    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y--) years.push(y);
    return years;
  }

  const displayValue = selectedDate ? formatDisplayDate(selectedDate) : '--.--.----';

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>
        <BsCalendar3 className={fieldStyles.labelIcon} />
        {label}
      </label>

      <div className={styles.wrapper} ref={wrapperRef}>
        <button
          type='button'
          className={`${styles.trigger} ${hasError ? fieldStyles.inputError : ''}`}
          onClick={() => setIsOpen(!isOpen)}>
          {/* <BsCalendar3 className={styles.iconCalendar} /> */}
          <span>{displayValue}</span>
        </button>

        {isOpen && (
          <div className={clsx(styles.popover, isOpen && styles.popoverOpen)}>
            <div className={styles.header}>
              <button
                type='button'
                className={styles.navBtn}
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                aria-label='prev'>
                <BsCaretLeftFill className={styles.navBtnIcon} />
              </button>

              <div className={styles.selects}>
                <select className={styles.selectMonth} value={month} onChange={handleMonthChange}>
                  {monthLabels.map((label, i) => (
                    <option key={label} value={i}>
                      {label}
                    </option>
                  ))}
                </select>

                <select className={styles.selectYear} value={year} onChange={handleYearChange}>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type='button'
                className={styles.navBtn}
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                aria-label='next'>
                <BsCaretRightFill className={styles.navBtnIcon} />
              </button>
            </div>

            <div className={styles.weekdays}>
              {weekdays.map((w, i) => (
                <span key={w} className={i >= 5 ? styles.weekend : undefined}>
                  {w}
                </span>
              ))}
            </div>

            <div className={styles.grid}>
              {cells.map(({ date, inMonth }) => {
                const key = toDateKey(date);
                const day = startOfDay(date);
                const disabled = (!!min && day < min) || (!!max && day > max);
                const isToday = toDateKey(today) === key;
                const isSelected = field.value === key;

                const dayClasses = [
                  styles.day,
                  !inMonth && styles.outMonth,
                  disabled && styles.disabled,
                  isSelected && styles.endpoint,
                  isToday && !isSelected && styles.today,
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div key={key} className={styles.cell}>
                    <button
                      type='button'
                      disabled={disabled}
                      onClick={() => handlePick(date)}
                      className={dayClasses}>
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hasError && <span className={fieldStyles.error}>{meta.error}</span>}
    </div>
  );
}
