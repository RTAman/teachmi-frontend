import { NavLink } from 'react-router';
import styles from './BottomNav.module.css';

const TABS = [
  {
    to: '/home',
    label: '홈',
    icon: (
      <>
        <path d="M4 11l8-7 8 7" />
        <path d="M6 9.5V20h12V9.5" />
      </>
    ),
  },
  {
    to: '/learn',
    label: '학습하기',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
  },
  {
    to: '/records',
    label: '학습 기록',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
  {
    to: '/reports',
    label: '성장 리포트',
    icon: <path d="M5 20v-6M12 20V5M19 20v-9" />,
  },
  {
    to: '/my',
    label: '마이페이지',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" />
      </>
    ),
  },
];

export default function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="주요 메뉴">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {tab.icon}
          </svg>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
