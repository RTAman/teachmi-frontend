const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

export function isPassword(value) {
  return value.length >= 8 && value.length <= 64;
}

export const EMAIL_ERROR = '이메일 형식으로 입력해 주세요.';
export const PASSWORD_HINT = '8~64자로 입력해 주세요.';
export const PASSWORD_ERROR = '비밀번호는 8~64자로 입력해 주세요.';
