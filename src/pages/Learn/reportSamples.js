export const SAMPLE_REPORT = {
  comparedWith: '10월 23일',
  elements: { before: 1, after: 3 },
  hints: { before: 3, after: 1 },
  stuck: { before: 4, after: 1 },
  flowSummary: '처음엔 망설였지만, 힌트 뒤부터 혼자 설명이 늘었어요',
  turns: [
    { count: 0, event: 'stuck' },
    { count: 0, event: 'hint' },
    { count: 1, event: 'stuck' },
    { count: 1 },
    { count: 2 },
    { count: 3 },
  ],
  firstAnswer: '산 해에 전액 비용으로 처리하는 거 아닌가? 나도 조금 헷갈리네.',
  turnCount: 6,
  hintCount: 1,
  finalExplanation: [
    { text: '컴퓨터는 ' },
    { text: '자산으로 인식', mark: true },
    { text: '하고, 수익을 내는 ' },
    { text: '내용연수 동안 취득원가를 나눠', mark: true },
    { text: ' 비용으로 처리해. 그래야 ' },
    { text: '각 기간의 수익과 비용이 맞아', mark: true },
    { text: '.' },
  ],
  newElements: ['자산 인식', '내용연수에 걸친 배분', '수익·비용 대응'],
  areas: [
    { title: '개념 이해', tag: '확인됨', tone: 'ok', text: '비용 배분의 의미를 스스로 설명했어요' },
    { title: '원리 설명', tag: '힌트 도움으로 확인', tone: 'ai', text: '나누는 이유는 힌트를 받은 뒤 설명했어요' },
  ],
  understood: ['유형자산은 취득원가를 사용 기간에 걸쳐 비용으로 배분한다'],
  improve: [
    { title: '내용연수로 나누는 계산', text: '응용문제에서 계산을 잘못 적용했어요' },
    { title: '감가상각 방법의 차이', text: '필요하면 정액법·정률법을 이어서 학습' },
  ],
};

export const SAMPLE_PROBLEM_RECORDS = [
  { tries: [{ answer: 3000000, correct: false }], reteach: '', revealed: true },
  { tries: [{ answer: 900000, correct: true }], reteach: '', revealed: false },
];
