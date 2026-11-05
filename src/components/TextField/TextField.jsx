import { useId } from 'react';
import InlineError from '../InlineError/InlineError';
import styles from './TextField.module.css';

export default function TextField({ label, required, unit, mono, hint, error, multiline, ...rest }) {
  const id = useId();
  const messageId = `${id}-message`;
  const Control = multiline ? 'textarea' : 'input';
  const controlClass = [styles.control, multiline ? styles.multiline : '', mono ? styles.mono : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <div className={`${styles.box} ${error ? styles.invalid : ''}`}>
        <Control
          id={id}
          className={controlClass}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          {...rest}
        />
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {error && <InlineError id={messageId}>{error}</InlineError>}
      {!error && hint && (
        <p id={messageId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
