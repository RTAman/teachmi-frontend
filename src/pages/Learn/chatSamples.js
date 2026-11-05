export const CHAT_NOTICE = 'AI 학생은 정답을 알려 주지 않아요. 내 말로 설명해 주세요.';

export const FIRST_MESSAGES = [
  {
    id: 'm1',
    from: 'ai',
    face: 'curious',
    label: '궁금한 점이 있어요',
    text: '회사에서 300만 원짜리 컴퓨터를 샀는데 3년 동안 쓴대요. 산 해에 300만 원을 모두 비용으로 처리하면 안 되나요?',
  },
];

export const AI_REPLIES = [
  {
    face: 'confused',
    text: '그런데 컴퓨터를 3년 동안 계속 쓰는데, 산 해에 전부 비용으로 처리하는 게 맞을까요?',
  },
  {
    face: 'curious',
    label: '궁금한 점이 있어요',
    text: '아하, 쓰는 기간에 나눈다는 거군요. 그럼 매년 얼마씩 비용으로 잡으면 돼요?',
  },
  {
    face: 'curious',
    text: '그렇게 나누면 3년 뒤에는 컴퓨터 장부금액이 얼마가 남아요?',
  },
];

export const FALLBACK_REPLY = {
  face: 'confused',
  text: '음, 조금 더 쉽게 말해 줄 수 있어요? 왜 그렇게 되는지 궁금해요.',
};

export const HINT_REPLY = {
  face: 'curious',
  label: '힌트',
  text: '컴퓨터가 돈을 벌어다 주는 기간이 몇 년인지 떠올려 보면 어때요?',
};

export const DONT_KNOW_REPLY = {
  face: 'curious',
  label: '같이 생각해 봐요',
  text: '괜찮아요! 그럼 이렇게 물어볼게요. 컴퓨터는 1년만 쓰고 버리나요, 3년 동안 계속 쓰나요?',
};

export const EXAMPLE_REPLY = {
  face: 'curious',
  label: '쉬운 예시',
  text: '1년 치 헬스장 회원권을 12만 원에 샀다면, 한 달에 얼마씩 쓴 셈일까요? 이것처럼 생각해 볼 수 있을까요?',
};

export const WRAP_UP_QUESTION = {
  face: 'curious',
  label: '마지막 정리',
  text: '설명해 줘서 고마워요! 마지막으로 감가상각이 무엇인지 한두 문장으로 정리해 줄래요?',
};

export const WRAP_UP_REPLY = {
  face: 'got-it',
  label: '이해했어요',
  text: '이제 알겠어요! 오래 쓰는 자산의 원가를 쓰는 기간에 나눠 비용으로 잡는 거군요. 덕분에 이해했어요.',
};
