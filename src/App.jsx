import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ComponentPreview from './pages/ComponentPreview';

// 화면 주소를 정하는 곳입니다. 새 화면을 만들면 여기에 <Route>를 추가합니다.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComponentPreview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
