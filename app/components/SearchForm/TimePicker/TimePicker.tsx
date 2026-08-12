'use client';

import { useEffect, useRef } from 'react';
import styles from './TimePicker.module.scss';
import { BsChevronDown, BsClock, BsExclamationCircle } from 'react-icons/bs';
import clsx from 'clsx';

type TimePickerProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value: string; // 'HH:mm'
  onChange: (value: string) => void;
  workStart?: string;
  workEnd?: string;
  step?: number; // минуты
  disabledBefore?: string; // напр. текущее время, если выбран сегодняшний день
  workingLabel: string;
  offHoursLabel: string;
  twoDateTime: boolean;
};

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toTimeString(minutes: number) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function buildSlots(step: number) {
  const slots: string[] = [];
  for (let m = 0; m < 24 * 60; m += step) slots.push(toTimeString(m));
  return slots;
}

export default function TimePicker({
  isOpen,
  setIsOpen,
  value,
  onChange,
  workStart = '06:00',
  workEnd = '22:00',
  step = 30,
  disabledBefore,
  workingLabel,
  offHoursLabel,
  twoDateTime,
}: TimePickerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const allSlots = buildSlots(step);
  const workStartMin = toMinutes(workStart);
  const workEndMin = toMinutes(workEnd);
  const disabledBeforeMin = disabledBefore ? toMinutes(disabledBefore) : null;

  const beforeWork = allSlots.filter((t) => toMinutes(t) < workStartMin);
  const working = allSlots.filter((t) => toMinutes(t) >= workStartMin && toMinutes(t) < workEndMin);
  const afterWork = allSlots.filter((t) => toMinutes(t) >= workEndMin);

  const handlePick = (time: string) => {
    if (disabledBeforeMin !== null && toMinutes(time) < disabledBeforeMin) return;
    onChange(time);
    setIsOpen(false);
  };

  const renderGroup = (slots: string[]) => (
    <div className={styles.grid}>
      {slots.map((time) => {
        const disabled = disabledBeforeMin !== null && toMinutes(time) < disabledBeforeMin;
        const isSelected = value === time;

        return (
          <button
            key={time}
            type='button'
            disabled={disabled}
            onClick={() => handlePick(time)}
            className={[styles.slot, isSelected && styles.selected, disabled && styles.disabled]
              .filter(Boolean)
              .join(' ')}>
            {time}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button type='button' className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.iconAndTime}>
          <BsClock className={styles.iconTime} />
          <span>{value || '--:--'}</span>
        </div>
        <BsChevronDown className={styles.selectArrow} />
      </button>

      {isOpen && (
        <div
          className={clsx(
            styles.popover,
            isOpen && styles.popoverOpen,
            twoDateTime && styles.popoverTwo,
          )}>
          {beforeWork.length > 0 && (
            <>
              <div className={styles.groupLabel}>
                <BsExclamationCircle className={styles.notWorkIcon} /> {offHoursLabel}
              </div>
              {renderGroup(beforeWork)}
            </>
          )}

          <div className={styles.groupLabel}>{workingLabel}</div>
          {renderGroup(working)}

          {afterWork.length > 0 && (
            <>
              <div className={styles.groupLabel}>
                <BsExclamationCircle className={styles.notWorkIcon} /> {offHoursLabel}
              </div>
              {renderGroup(afterWork)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
