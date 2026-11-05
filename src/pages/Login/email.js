const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

export const EMAIL_ERROR = '이메일 형식으로 입력해 주세요.';
