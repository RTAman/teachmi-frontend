import styles from './Button.module.css';

// variant: 'primary' | 'secondary'
// size: 'lg'(하단 버튼, 높이 54) | 'md'(확인 창 버튼, 높이 52)
// 비활성 상태는 disabled를 넘기면 됩니다. onClick 등 나머지 값은 <button>에 그대로 전달됩니다.
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
