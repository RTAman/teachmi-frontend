import { PROBLEMS } from './problemSamples';

export function summarizeProblems(records) {
  return PROBLEMS.map((problem, index) => {
    const record = records[index] ?? { tries: [] };
    const last = record.tries.at(-1);
    const correct = Boolean(last?.correct);
    const retried = record.tries.length > 1;
    let tag = '오답';
    let tone = 'bad';
    if (correct && retried) {
      tag = '정답 · 재설명 후';
      tone = 'ok';
    } else if (correct) {
      tag = '정답';
      tone = 'ok';
    }
    let meta = '힌트 없음';
    if (correct && !retried) meta = '힌트 없음 · 풀이 근거 적절';
    if (retried) meta = correct ? '첫 시도 오답 → 다시 설명 → 정답' : '다시 설명 후에도 오답';
    return {
      id: problem.id,
      title: `문제 ${index + 1} · ${problem.title}`,
      tag,
      tone,
      meta,
      solvedAlone: correct && !retried,
    };
  });
}
