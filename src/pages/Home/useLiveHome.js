import { useEffect, useState } from 'react';
import { getHome } from '../../api/assessment';
import { STAGE_ROUTES } from '../../learning/useLearningSession';
import { HOME_SAMPLES } from './homeSamples';

const STAGE_PROGRESS = {
  mode: { step: 2, label: '02 시작 방식 단계에서 멈췄어요' },
  summary: { step: 3, label: '03 개념 정리 단계에서 멈췄어요' },
  chat: { step: 3, label: '03 개념 설명 단계에서 멈췄어요' },
  problem: { step: 4, label: '04 문제 풀이 단계에서 멈췄어요' },
  report: { step: 5, label: '05 성장 확인 단계에서 멈췄어요' },
};

const LIVE_MESSAGE = '오늘 배운 개념, 저한테 설명해 줄래요?';

function formatDate(value) {
  const date = new Date(value);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function toReportCard(report) {
  const allSolved = report.independentCorrect === report.total;
  return {
    id: report.reportId,
    meta: formatDate(report.createdAt),
    title: report.conceptName,
    to: '/learn/report',
    linkState: { sessionId: report.sessionId },
    tags: [{ tone: allSolved ? 'ok' : 'warn', label: `응용문제 ${report.independentCorrect}/${report.total} 정답` }],
  };
}

function toProgressCard(item) {
  return {
    id: item.sessionId,
    meta: '진행 중',
    title: item.conceptName,
    to: STAGE_ROUTES[item.resumeStage] ?? '/learn',
    inProgress: STAGE_PROGRESS[item.resumeStage] ?? STAGE_PROGRESS.chat,
  };
}

function toHome(view) {
  if (view.firstVisit) return HOME_SAMPLES.first;
  const sessions = view.recentReports.map(toReportCard);
  if (view.inProgress) sessions.push(toProgressCard(view.inProgress));
  return { ...HOME_SAMPLES.records, message: LIVE_MESSAGE, sessions };
}

export default function useLiveHome(live) {
  const [home, setHome] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!live) return undefined;
    let active = true;
    getHome()
      .then((view) => active && setHome(toHome(view)))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [live]);

  return { home, failed };
}
