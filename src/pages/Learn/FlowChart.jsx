import hintBadge from '../../assets/icons/hint-badge.svg';
import stuckBadge from '../../assets/icons/stuck-badge.svg';
import styles from './ReportPage.module.css';

const WIDTH = 318;
const HEIGHT = 180;
const LEFT = 28;
const RIGHT = 298;
const TOP = 32;
const BOTTOM = 140;

export default function FlowChart({ turns }) {
  const max = Math.max(3, ...turns.map((turn) => turn.count));
  const step = turns.length > 1 ? (RIGHT - LEFT) / (turns.length - 1) : 0;
  const x = (index) => LEFT + step * index;
  const y = (value) => BOTTOM - ((BOTTOM - TOP) * value) / max;
  const points = turns.map((turn, index) => [x(index), y(turn.count)]);
  const line = points.map(([px, py]) => `${px},${py}`).join(' ');
  const area = `${LEFT},${BOTTOM} ${line} ${x(turns.length - 1)},${BOTTOM}`;
  const last = points.at(-1);
  const lastCount = turns.at(-1).count;
  const ticks = Array.from({ length: max + 1 }, (_, value) => value);

  return (
    <svg
      className={styles.chart}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`대화 ${turns.length}턴 동안 혼자 말한 핵심 요소가 ${turns[0].count}개에서 ${lastCount}개로 늘었어요`}
    >
      {ticks.map((value) => (
        <g key={value}>
          <line x1={LEFT} x2={WIDTH - 4} y1={y(value)} y2={y(value)} className={styles.grid} />
          <text x={12} y={y(value) + 4} className={styles.axis} textAnchor="middle">
            {value}
          </text>
        </g>
      ))}
      <polygon points={area} className={styles.area} />
      <polyline points={line} className={styles.line} />
      {points.map(([px, py], index) => {
        const isLast = index === points.length - 1;
        return (
          <g key={px}>
            <circle cx={px} cy={py} r={isLast ? 7 : 4.5} className={isLast ? styles.lastDot : styles.dot} />
            <text x={px} y={BOTTOM + 24} className={styles.axis} textAnchor="middle">
              {index + 1}턴
            </text>
            {turns[index].event && (
              <image
                href={turns[index].event === 'hint' ? hintBadge : stuckBadge}
                x={px - 11}
                y={py - 34}
                width={22}
                height={22}
              />
            )}
          </g>
        );
      })}
      <g transform={`translate(${last[0] - 128} ${last[1] - 6})`}>
        <rect width={106} height={26} rx={13} className={styles.callout} />
        <text x={53} y={17} textAnchor="middle" className={styles.calloutText}>
          혼자 {lastCount}개 설명!
        </text>
      </g>
    </svg>
  );
}
