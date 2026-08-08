'use client';

import { useEffect, useRef } from 'react';
import styles from './CustomSelect.module.scss';
import { BsChevronDown, BsGeoAlt } from 'react-icons/bs';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
}

export default function CustomSelect({
  isOpen,
  setIsOpen,
  value,
  onChange,
  options,
  placeholder,
}: CustomSelectProps) {
  const selected = options.find((o) => o.value === value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (e: React.MouseEvent, optValue: string) => {
    e.stopPropagation();
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={styles.selectWrapper}>
      <div className={`${styles.select} ${isOpen ? styles.open : ''}`} onClick={handleTriggerClick}>
        <BsGeoAlt className={styles.selectPoint} />
        {selected?.label || placeholder}
        <BsChevronDown className={styles.selectArrow} />
      </div>

      <div className={`${styles.optionsList} ${isOpen ? styles.optionsOpen : ''}`}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
            onClick={(e) => handleOptionClick(e, option.value)}>
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
