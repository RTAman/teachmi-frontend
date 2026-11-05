export const ACCEPTED_EXTENSIONS = ['pdf', 'ppt', 'pptx'];
export const MAX_FILE_MB = 20;

export const ANALYSIS_STEPS = [
  { todo: '글자 읽기', current: '글자 읽는 중', done: '글자 읽기 완료' },
  { todo: '핵심 개념 찾기', current: '핵심 개념 찾는 중', done: '핵심 개념 찾기 완료' },
  { todo: '개념별 범위 정리', current: '개념별 범위 정리 중', done: '개념별 범위 정리 완료' },
];

export const SAMPLE_FILE = {
  name: '회계원리_7주차_유형자산.pdf',
  size: 4.2 * 1024 * 1024,
  pages: 22,
};

export const SAMPLE_FAILED_FILE = {
  name: '회계원리_7주차_스캔본.pdf',
  size: 6.8 * 1024 * 1024,
};

export const SAMPLE_SUBJECT = '회계원리 – 유형자산';

export const SAMPLE_CONCEPTS = [
  {
    id: 'c1',
    name: '유형자산의 최초 인식',
    pages: 'p.3–5',
    summary: '취득원가에 포함되는 항목',
    scope: '유형자산을 처음 장부에 올릴 때 취득원가에 포함되는 항목과 그 이유',
  },
  {
    id: 'c2',
    name: '감가상각의 개념',
    pages: 'p.6–9',
    summary: '취득원가를 내용연수에 걸쳐 배분하는 이유',
    scope: '유형자산의 취득원가를 내용연수에 걸쳐 비용으로 배분하는 이유와 원리',
  },
  {
    id: 'c3',
    name: '감가상각 방법',
    pages: 'p.10–14',
    summary: '정액법과 정률법의 계산 차이',
    scope: '정액법과 정률법으로 감가상각비를 계산하는 방법과 차이',
  },
  {
    id: 'c4',
    name: '유형자산 처분손익',
    pages: 'p.15–17',
    summary: '장부금액과 처분금액의 차이',
    scope: '유형자산을 처분할 때 장부금액과 처분금액의 차이로 손익을 계산하는 방법',
  },
];
