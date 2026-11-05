import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ComponentPreview from './pages/ComponentPreview';
import PlaceholderPage from './pages/PlaceholderPage';

// 화면 주소를 정하는 곳입니다. 새 화면을 만들면 여기에 <Route>를 추가합니다.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlaceholderPage title="홈" />} />
        <Route path="/learn" element={<PlaceholderPage title="학습하기" showNav={false} />} />
        <Route path="/records" element={<PlaceholderPage title="학습 기록" />} />
        <Route path="/reports" element={<PlaceholderPage title="성장 리포트" />} />
        <Route path="/my" element={<PlaceholderPage title="마이페이지" />} />
        <Route path="/dev/components" element={<ComponentPreview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
