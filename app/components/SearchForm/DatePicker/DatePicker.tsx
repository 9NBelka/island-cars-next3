'use client';

import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../../../i18n/types';
import styles from './DatePicker.module.scss';
import { BsCalendar3, BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs';
import clsx from 'clsx';

type DatePickerProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value: string; // 'YYYY-MM-DD' — своя дата этого конкретного пикера
  onChange: (value: string) => void;
  lang: Lang;
  minDate?: Date;
  rangeStart?: string; // 'YYYY-MM-DD' — для подсветки диапазона в обоих календарях
  rangeEnd?: string;
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

export default function DatePicker({
  isOpen,
  setIsOpen,
  value,
  onChange,
  lang,
  minDate,
  rangeStart,
  rangeEnd,
}: DatePickerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const locale = LOCALE_MAP[lang];
  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(minDate) : today;

  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const [viewDate, setViewDate] = useState(() => selectedDate ?? min);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = buildMonthGrid(year, month);
  const weekdays = getWeekdayLabels(locale);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
    viewDate,
  );

  const handlePick = (date: Date) => {
    if (startOfDay(date) < min) return;
    onChange(toDateKey(date));
    setIsOpen(false);
  };

  function formatDisplayDate(date: Date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  }

  const displayValue = selectedDate ? formatDisplayDate(selectedDate) : '--.--.----';

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button type='button' className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <BsCalendar3 className={styles.iconCalendar} />
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
            <p className={styles.monthLabel}>{monthLabel}</p>
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
            {cells.map(({ date, inMonth }, i) => {
              const key = toDateKey(date);
              const disabled = startOfDay(date) < min;
              const isToday = toDateKey(today) === key;

              const isRangeStart = !!rangeStart && key === rangeStart;
              const isRangeEnd = !!rangeEnd && key === rangeEnd;
              const isEndpoint = isRangeStart || isRangeEnd;

              const isInRange =
                !!rangeStart &&
                !!rangeEnd &&
                rangeStart !== rangeEnd &&
                key > rangeStart &&
                key < rangeEnd;

              const colIndex = i % 7;

              const inBarCell =
                !!rangeStart && !!rangeEnd && rangeStart !== rangeEnd && (isEndpoint || isInRange);

              const isSegmentLeftEdge = inBarCell && (colIndex === 0 || isRangeStart);
              const isSegmentRightEdge = inBarCell && (colIndex === 6 || isRangeEnd);

              const cellClasses = [
                styles.cell,
                inBarCell && styles.inBar,
                isSegmentLeftEdge && styles.barRoundLeft,
                isSegmentRightEdge && styles.barRoundRight,
              ]
                .filter(Boolean)
                .join(' ');

              const dayClasses = [
                styles.day,
                !inMonth && styles.outMonth,
                disabled && styles.disabled,
                isEndpoint && styles.endpoint,
                isToday && !isEndpoint && styles.today,
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div key={key} className={cellClasses}>
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
  );
}
