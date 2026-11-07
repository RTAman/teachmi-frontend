const CODE_MESSAGES = {
  NETWORK: '서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.',
  INVALID_EMAIL: '이메일 형식을 확인해 주세요.',
  INVALID_PASSWORD: '비밀번호는 8~64자로 입력해 주세요.',
  EMAIL_ALREADY_REGISTERED: '이미 가입한 이메일이에요. 로그인해 주세요.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않아요.',
  TOO_MANY_LOGIN_ATTEMPTS: '로그인 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.',
  CONCEPT_REQUIRED: '개념 이름과 학습 범위를 입력해 주세요.',
  TEXT_REQUIRED: '자료 내용을 붙여 넣어 주세요.',
  NOT_FOUND: '자료를 찾을 수 없어요.',
  TURN_IN_PROGRESS: 'AI 학생이 아직 답을 쓰고 있어요. 잠시만 기다려 주세요.',
};

const STATUS_MESSAGES = {
  0: CODE_MESSAGES.NETWORK,
  404: '찾을 수 없어요.',
  413: '파일 용량이 너무 커요.',
  415: '지원하지 않는 파일 형식이에요.',
  429: '요청이 많아요. 잠시 후 다시 시도해 주세요.',
  502: 'AI 학생이 답을 만들지 못했어요. 다시 시도해 주세요.',
  503: 'AI 학생이 답을 만들지 못했어요. 잠시 후 다시 시도해 주세요.',
};

export function messageFor(error, fallback = '잠시 후 다시 시도해 주세요.') {
  return CODE_MESSAGES[error?.code] ?? STATUS_MESSAGES[error?.status] ?? fallback;
}
