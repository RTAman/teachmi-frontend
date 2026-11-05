import { useEffect, useRef } from 'react';

// 브라우저 기본 <dialog>를 open 값에 맞춰 열고 닫습니다.
// 기본 <dialog>를 쓰면 포커스 가두기와 뒤 화면 비활성화가 자동으로 처리됩니다.
export default function useModalDialog(open) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return ref;
}
