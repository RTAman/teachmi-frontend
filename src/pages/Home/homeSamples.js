const sessions = [
  {
    id: 's1',
    meta: '회계원리 · 10월 30일 · 복습',
    title: '감가상각',
    to: '/reports',
    tags: [
      { tone: 'ok', label: '응용문제 2/2 정답' },
      { tone: 'neutral', label: '힌트 1회' },
    ],
  },
  {
    id: 's2',
    meta: '자료구조 · 10월 27일 · 처음 학습',
    title: '스택',
    to: '/reports',
    tags: [
      { tone: 'warn', label: '응용문제 1/2 정답' },
      { tone: 'neutral', label: '보완 1개' },
    ],
  },
  {
    id: 's3',
    meta: '미시경제 · 진행 중',
    title: '기회비용',
    to: '/learn',
    inProgress: { step: 3, label: '03 개념 설명 단계에서 멈췄어요' },
  },
];

const question = '300만 원짜리 컴퓨터를 왜 3년에 나눠서 비용으로 잡아요? 저한테 설명해 줄래요?';

export const HOME_SAMPLES = {
  records: {
    heading: ['오늘은 어떤 개념을', '설명해 볼까요?'],
    subheading: '강의자료에서 개념 하나를 골라 AI 학생에게 가르쳐 보세요.',
    message: question,
    showCharacters: true,
    sessions,
  },
  first: {
    heading: ['첫 개념을', 'AI 학생에게 가르쳐 볼까요?'],
    subheading: '설명하다 막히는 곳이 아직 이해하지 못한 곳이에요.',
    message: '안녕하세요! 저는 아직 아무것도 모르는 AI 학생이에요. 오늘 배운 걸 저한테 알려 주세요.',
    showCharacters: true,
    sessions: [],
  },
  streak: {
    heading: ['오늘은 어떤 개념을', '설명해 볼까요?'],
    subheading: '강의자료에서 개념 하나를 골라 AI 학생에게 가르쳐 보세요.',
    message: question,
    showCharacters: false,
    streak: {
      title: '3일째 이어서 설명하고 있어요',
      description: '오늘 하나 더 설명하면 4일 연속이에요',
      days: [
        { label: '월', status: 'done' },
        { label: '화', status: 'done' },
        { label: '수', status: 'done' },
        { label: '목', status: 'today' },
        { label: '금', status: 'rest' },
        { label: '토', status: 'rest' },
        { label: '일', status: 'rest' },
      ],
    },
    sessions,
  },
};

export const FIRST_USE_STEPS = [
  { title: '강의자료 올리기', description: 'PDF나 PPT 파일 하나' },
  { title: '설명할 개념 하나 고르기', description: '자료에서 찾은 개념 중 선택' },
  { title: 'AI 학생의 질문에 답하며 설명하기', description: '막히면 힌트나 쉬운 예시를 받을 수 있어요' },
  { title: '새 문제 풀고 리포트 확인', description: '처음과 마지막 설명이 어떻게 달라졌는지' },
];
