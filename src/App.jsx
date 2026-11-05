import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ComponentPreview from './pages/ComponentPreview';
import LoginFormPage from './pages/Login/LoginFormPage';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Login/SignupPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/id" element={<LoginFormPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
