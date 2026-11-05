import { useId } from 'react';
import InlineError from '../InlineError/InlineError';
import styles from './TextField.module.css';

// 입력칸입니다. multiline을 넘기면 여러 줄 입력(TextArea)이 됩니다.
// unit: 입력칸 오른쪽 단위(예: "원") / mono: 숫자용 고정폭 글꼴(S06 답 입력)
// hint: 입력칸 아래 안내 문구 / error: 오류 문구 (hint보다 우선)
// value, onChange 등 나머지 값은 입력칸에 그대로 전달됩니다.
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
