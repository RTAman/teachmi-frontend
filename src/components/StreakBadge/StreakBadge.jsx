import emotionSunny from '../../assets/characters/emotion-sunny.png';
import doneIcon from '../../assets/icons/streak-done.svg';
import restIcon from '../../assets/icons/streak-rest.svg';
import todayIcon from '../../assets/icons/streak-today.svg';
import styles from './StreakBadge.module.css';

const DAY_ICONS = { done: doneIcon, today: todayIcon, rest: restIcon };
const DAY_STATUS_LABELS = { done: '완료', today: '오늘', rest: '예정' };

export default function StreakBadge({ title, description, days }) {
  return (
    <section className={styles.badge}>
      <img src={emotionSunny} alt="" width="56" height="56" />
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <ul className={styles.days}>
          {days.map((day) => (
            <li key={day.label}>
              <img
                src={DAY_ICONS[day.status]}
                alt={`${day.label} ${DAY_STATUS_LABELS[day.status]}`}
                width="18"
                height="18"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
