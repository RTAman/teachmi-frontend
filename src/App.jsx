import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import AuthProvider from './auth/AuthProvider';
import { GuestOnly, RequireLogin } from './auth/RouteGuards';
import ComponentPreview from './pages/ComponentPreview';
import HomePage from './pages/Home/HomePage';
import ChatPage from './pages/Learn/ChatPage';
import ModePage from './pages/Learn/ModePage';
import ProblemPage from './pages/Learn/ProblemPage';
import ReportDetailPage from './pages/Learn/ReportDetailPage';
import ReportPage from './pages/Learn/ReportPage';
import SummaryPage from './pages/Learn/SummaryPage';
import LoginFormPage from './pages/Login/LoginFormPage';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Login/SignupPage';
import MaterialPage from './pages/Material/MaterialPage';
import MyPage from './pages/My/MyPage';
import RecordsPage from './pages/Records/RecordsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import SplashPage from './pages/Splash/SplashPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/id" element={<LoginFormPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
          <Route element={<RequireLogin />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/learn" element={<MaterialPage />} />
            <Route path="/learn/mode" element={<ModePage />} />
            <Route path="/learn/summary" element={<SummaryPage />} />
            <Route path="/learn/chat" element={<ChatPage />} />
            <Route path="/learn/problem" element={<ProblemPage />} />
            <Route path="/learn/report" element={<ReportPage />} />
            <Route path="/learn/report/detail" element={<ReportDetailPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/my" element={<MyPage />} />
          </Route>
          <Route path="/dev/components" element={<ComponentPreview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
