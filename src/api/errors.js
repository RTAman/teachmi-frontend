const REVIEW_MESSAGE = '생성 결과 확인이 필요해요. 입력한 답변은 저장돼 있어요. 다시 요청하지 말고 지원 담당자에게 문의해 주세요.';
const LIMIT_MESSAGE = '이 답변의 생성 시도 한도에 도달했어요. 저장된 답변을 확인하고 지원 담당자에게 문의해 주세요.';
const CONFIG_MESSAGE = 'AI 설정을 확인해야 해요. 지원 담당자에게 문의해 주세요.';

const CODE_MESSAGES = {
  NETWORK: '서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.',
  INVALID_EMAIL: '이메일 형식을 확인해 주세요.',
  INVALID_PASSWORD: '비밀번호는 8~64자로 입력해 주세요.',
  EMAIL_ALREADY_REGISTERED: '이미 가입한 이메일이에요. 로그인해 주세요.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않아요.',
  TOO_MANY_LOGIN_ATTEMPTS: '로그인 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.',
  CONCEPT_REQUIRED: '개념 이름과 학습 범위를 입력해 주세요.',
  TEXT_REQUIRED: '자료 내용을 붙여 넣어 주세요.',
  EVIDENCE_TOO_LARGE: '붙여 넣은 내용이 너무 길어요. 15,000자 안으로 줄여 주세요.',
  NOT_FOUND: '자료를 찾을 수 없어요.',
  UNSUPPORTED_FORMAT: 'PDF나 PPT 파일만 올릴 수 있어요.',
  FILE_TOO_LARGE: '20MB 이하 파일로 올려 주세요.',
  FILE_REQUIRED: '파일을 선택해 주세요.',
  MATERIAL_ANALYSIS_BUSY: '분석 요청이 많아요. 잠시 후 다시 시도해 주세요.',
  TURN_IN_PROGRESS: 'AI 학생이 아직 답을 쓰고 있어요. 잠시만 기다려 주세요.',
  ASSESSMENT_GENERATION_PENDING: '문제를 만들 준비가 아직 안 됐어요. 잠시 후 다시 시도해 주세요.',
  ASSESSMENT_GRADING_PENDING: '채점 준비가 아직 안 됐어요. 잠시 후 다시 시도해 주세요.',
  ASSESSMENT_NOT_READY: '모든 문제를 마친 뒤 리포트를 볼 수 있어요.',
  REPORT_NOT_READY: '아직 리포트가 없어요. 문제를 모두 마친 뒤 확인해 주세요.',
  ASSESSMENT_EVIDENCE_STALE: '학습 내용이 바뀌었어요. 화면을 새로고침해 주세요.',
  ACTIVE_SESSION_EXISTS: '진행 중인 학습이 있어요. 먼저 마무리해 주세요.',
};

const STATUS_MESSAGES = {
  0: CODE_MESSAGES.NETWORK,
  404: '찾을 수 없어요.',
  413: CODE_MESSAGES.FILE_TOO_LARGE,
  415: CODE_MESSAGES.UNSUPPORTED_FORMAT,
  429: '요청이 많아요. 잠시 후 다시 시도해 주세요.',
  502: 'AI 학생이 답을 만들지 못했어요.',
  503: 'AI 학생이 답을 만들지 못했어요. 잠시 후 다시 시도해 주세요.',
};

export function terminalMessage({ code, recovery }) {
  if (recovery?.action === 'review_required' || code === 'AI_GENERATION_UNCERTAIN') return REVIEW_MESSAGE;
  if (recovery?.action === 'limit_reached' || code === 'AI_ATTEMPT_LIMIT') return LIMIT_MESSAGE;
  if (recovery?.action === 'check_configuration') return CONFIG_MESSAGE;
  return '';
}

export function isTerminal(error) {
  return Boolean(terminalMessage({ code: error?.code, recovery: error?.body?.recovery }));
}

export function canRetrySame(error) {
  return error?.status === 0 || error?.body?.recovery?.retryAllowed === true;
}

export function messageFor(error, fallback = '잠시 후 다시 시도해 주세요.') {
  return (
    terminalMessage({ code: error?.code, recovery: error?.body?.recovery }) ||
    CODE_MESSAGES[error?.code] ||
    STATUS_MESSAGES[error?.status] ||
    fallback
  );
}
