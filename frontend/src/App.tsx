import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { ResumePage } from './pages/ResumePage';
import { SkillGapPage } from './pages/SkillGapPage';
import { InterviewPage } from './pages/InterviewPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected App Layout Shell
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />

          {/* Protected Application Modules */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="skills" element={<SkillGapPage />} />
            <Route path="interview" element={<InterviewPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
