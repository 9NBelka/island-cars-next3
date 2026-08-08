'use client';

import type { IconType } from 'react-icons';
import { useField } from 'formik';
import styles from './FormField.module.scss';

type FormFieldProps = {
  name: string;
  label: string;
  icon: IconType;
  type?: string;
  placeholder?: string;
  hint?: string;
};

export default function FormField({
  name,
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  hint,
}: FormFieldProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={name} className={styles.label}>
          <Icon className={styles.labelIcon} />
          {label}
        </label>
        {/* {hint && <span className={styles.hint}>{hint}</span>} */}
      </div>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`${styles.input} ${hasError ? styles.inputError : ''}`}
        {...field}
        value={field.value ?? ''}
      />

      {hasError && <span className={styles.error}>{meta.error}</span>}
    </div>
  );
}
