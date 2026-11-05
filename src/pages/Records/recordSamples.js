export const RECOMMENDATION = {
  subject: '자료구조',
  concept: '큐',
  reason: '스택 학습에서 놓친 ‘먼저 들어온 것이 먼저 나간다’를 이어서 설명해 보세요.',
};

export const RECORDS = [
  {
    id: 'r1',
    subject: '회계원리',
    title: '감가상각',
    meta: '학습 2회 · 10월 30일',
    tags: [
      { text: '응용 2/2', tone: 'ok' },
      { text: '보완: 내용연수 계산', tone: 'neutral' },
    ],
  },
  {
    id: 'r2',
    subject: '회계원리',
    title: '유형자산의 최초 인식',
    meta: '1회 · 10월 18일',
    tags: [{ text: '응용 1/1', tone: 'ok' }],
  },
  {
    id: 'r3',
    subject: '자료구조',
    title: '스택',
    meta: '1회 · 10월 27일',
    tags: [
      { text: '응용 1/2', tone: 'warn' },
      { text: '보완 1개', tone: 'neutral' },
    ],
  },
  {
    id: 'r4',
    subject: '미시경제',
    title: '기회비용',
    meta: '진행 중',
    inProgress: true,
    tags: [{ text: '03 개념 설명에서 이어하기', tone: 'lime' }],
  },
];
