import { useEffect } from 'react';

// 모바일 키보드가 화면을 가리는 높이를 CSS 변수 --keyboard-inset에 저장합니다.
// 하단 버튼과 바텀시트가 이 값만큼 위로 올라갑니다.
export default function useKeyboardInset() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    const update = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      document.documentElement.style.setProperty('--keyboard-inset', `${inset}px`);
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);
}
