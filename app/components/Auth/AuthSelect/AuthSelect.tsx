'use client';

import { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';
import type { IconType } from 'react-icons';
import { BsChevronDown } from 'react-icons/bs';
import fieldStyles from '../FormField/FormField.module.scss';
import styles from './AuthSelect.module.scss';

interface Option {
  value: string;
  label: string;
}

interface AuthSelectProps {
  name: string;
  label: string;
  icon: IconType;
  options: Option[];
  placeholder: string;
}

export default function AuthSelect({
  name,
  label,
  icon: Icon,
  options,
  placeholder,
}: AuthSelectProps) {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === field.value);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = async (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        await helpers.setTouched(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, helpers]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = async (e: React.MouseEvent, optValue: string) => {
    e.stopPropagation();
    await helpers.setValue(optValue);
    helpers.setTouched(true);
    setIsOpen(false);
  };

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>
        <Icon className={fieldStyles.labelIcon} />
        {label}
      </label>

      <div ref={wrapperRef} className={styles.selectWrapper}>
        <div
          className={`${styles.select} ${isOpen ? styles.open : ''} ${hasError ? fieldStyles.inputError : ''}`}
          onClick={handleTriggerClick}>
          {/* <Icon className={styles.selectPoint} /> */}
          {selected?.label || placeholder}
          <BsChevronDown className={styles.selectArrow} />
        </div>

        <div className={`${styles.optionsList} ${isOpen ? styles.optionsOpen : ''}`}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${field.value === option.value ? styles.selected : ''}`}
              onClick={(e) => handleOptionClick(e, option.value)}>
              {option.label}
            </div>
          ))}
        </div>
      </div>

      {hasError && <span className={fieldStyles.error}>{meta.error}</span>}
    </div>
  );
}
