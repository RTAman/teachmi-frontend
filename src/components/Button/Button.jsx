import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'lg',
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
