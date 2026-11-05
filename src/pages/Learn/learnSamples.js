export const SAMPLE_SESSION = {
  subject: '회계원리',
  conceptName: '감가상각의 개념',
  title: '감가상각',
  source: '회계원리_7주차_유형자산.pdf · p.6–9',
};

export const SAMPLE_SUMMARY = {
  core: [
    { text: '유형자산의 ' },
    { text: '취득원가', strong: true },
    { text: '를 ' },
    { text: '내용연수', strong: true },
    { text: '에 걸쳐 체계적으로 비용으로 배분하는 과정' },
  ],
  example: {
    text: '3년 동안 쓸 300만 원짜리 컴퓨터를 샀다면, 그 원가를 3년에 나눠 비용으로 잡아요.',
    total: '3,000,000원',
    years: [
      { label: '1년차', amount: '1,000,000' },
      { label: '2년차', amount: '1,000,000' },
      { label: '3년차', amount: '1,000,000' },
    ],
  },
  terms: ['취득원가', '내용연수', '잔존가치'],
  question: '왜 한 번에 비용으로 처리하지 않고 여러 해에 나눌까요?',
};
