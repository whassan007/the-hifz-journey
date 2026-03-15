import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Core Views
import { AdminLayout } from './components/AdminLayout';
import { LoginView } from './screens/LoginView';
import { DashboardView } from './screens/DashboardView';
import { StudentProgressView } from './screens/analytics/StudentProgressView';
import { VerseDifficultyView } from './screens/analytics/VerseDifficultyView';
import { UsersView } from './screens/UsersView';
import { AuditLogView } from './screens/AuditLogView';

export interface AdminSession {
  email: string;
  name: string;
  picture?: string;
  expiresAt: number;
}

export const AdminApp = () => {
  const [session, setSession] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('hifz_admin_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Admin session expires after 8 hours of inactivity
      if (Date.now() < parsed.expiresAt) {
        return parsed;
      }
      localStorage.removeItem('hifz_admin_session');
    }
    return null;
  });

  const handleLogin = (newSession: AdminSession) => {
    localStorage.setItem('hifz_admin_session', JSON.stringify(newSession));
    setSession(newSession);
  };

  const handleLogout = () => {
    localStorage.removeItem('hifz_admin_session');
    setSession(null);
  };

  // Setup heartbeat to extend session on activity (8 hours = 28800000 ms)
  useEffect(() => {
    if (!session) return;
    
    const extendSession = () => {
      const updated = { ...session, expiresAt: Date.now() + 28800000 };
      localStorage.setItem('hifz_admin_session', JSON.stringify(updated));
      setSession(updated);
    };

    window.addEventListener('click', extendSession);
    window.addEventListener('keydown', extendSession);
    
    return () => {
      window.removeEventListener('click', extendSession);
      window.removeEventListener('keydown', extendSession);
    };
  }, [session]);

  return (
    <BrowserRouter basename="/admin">
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white" dir="ltr">
        <Routes>
          {!session ? (
            <>
              <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <Route element={<AdminLayout session={session} onLogout={handleLogout} />}>
              <Route path="/" element={<DashboardView />} />
              <Route path="/analytics/students" element={<StudentProgressView />} />
              <Route path="/analytics/verses" element={<VerseDifficultyView />} />
              <Route path="/users" element={<UsersView />} />
              <Route path="/audit" element={<AuditLogView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
};
