export const PROBLEM_GUIDE = [
  { tag: '문제 2개', tone: 'neutral', text: '대화에서 쓴 사례와 다른 상황이에요' },
  { tag: '힌트 없이', tone: 'neutral', text: '이 단계에서는 AI 학생이 도와주지 않아요' },
  { tag: '다시 설명 1번', tone: 'lime', text: '틀리면 정답을 보기 전에 한 번 더 설명할 수 있어요' },
];

export const PROBLEMS = [
  {
    id: 'p1',
    title: '정액법 연간 상각비',
    question: [
      { text: '아래 기계를 정액법으로 감가상각할 때 ' },
      { text: '연간 감가상각비', strong: true },
      { text: '는 얼마인가요?' },
    ],
    facts: [
      { label: '취득원가', value: '6,000,000원', mono: true },
      { label: '내용연수', value: '3년', mono: true },
      { label: '잔존가치', value: '0원', mono: true },
      { label: '상각 방법', value: '정액법' },
    ],
    summary: '취득원가 6,000,000원 · 내용연수 3년 · 잔존가치 0원 · 상각 방법 정액법 · 연간 감가상각비는?',
    answer: 2000000,
    unit: '원 / 년',
    recheck: '내용연수를 몇 년으로 나눴는지 확인해 보세요.',
    aiAsk: '정답 보기 전에 저한테 한 번만 더 설명해 줄래요? 기계를 3년 쓰면 1년에 얼마씩 비용이 되는지 궁금해요.',
    formula: [{ text: '(6,000,000 − 0) ÷ ' }, { text: '3년', mark: true }, { text: ' = 2,000,000원' }],
    years: ['200만', '200만', '200만'],
    rightPoints: ['쓰는 기간 동안 같은 금액으로 나눈다는 원리를 적용했어요', '내용연수 3년으로 정확히 나눴어요'],
    wrongPoints: [
      { ok: true, text: '쓰는 기간 동안 같은 금액으로 나눈다는 원리는 맞아요' },
      { ok: false, text: '내용연수 3년을 그대로 적용하지 못했어요' },
    ],
  },
  {
    id: 'p2',
    title: '잔존가치가 있는 경우',
    question: [
      { text: '아래 차량을 정액법으로 감가상각할 때 ' },
      { text: '연간 감가상각비', strong: true },
      { text: '는 얼마인가요?' },
    ],
    facts: [
      { label: '취득원가', value: '5,000,000원', mono: true },
      { label: '내용연수', value: '5년', mono: true },
      { label: '잔존가치', value: '500,000원', mono: true },
      { label: '상각 방법', value: '정액법' },
    ],
    summary: '취득원가 5,000,000원 · 내용연수 5년 · 잔존가치 500,000원 · 상각 방법 정액법 · 연간 감가상각비는?',
    answer: 900000,
    unit: '원 / 년',
    recheck: '잔존가치를 먼저 뺐는지 확인해 보세요.',
    aiAsk: '정답 보기 전에 한 번만 더 설명해 줄래요? 5년 뒤에 남는 50만 원은 어떻게 처리해야 할지 궁금해요.',
    formula: [{ text: '(5,000,000 − ' }, { text: '500,000', mark: true }, { text: ') ÷ 5년 = 900,000원' }],
    years: ['90만', '90만', '90만', '90만', '90만'],
    rightPoints: ['잔존가치를 빼고 나눠야 한다는 점을 알고 있어요', '내용연수 5년으로 정확히 나눴어요'],
    wrongPoints: [
      { ok: true, text: '정액법으로 매년 같은 금액을 나눈다는 원리는 맞아요' },
      { ok: false, text: '잔존가치를 빼지 않고 계산했어요' },
    ],
  },
];

export const RETEACH_REPLY = '아하, 그렇게 나누는 거군요! 이제 다시 풀어 볼래요?';
