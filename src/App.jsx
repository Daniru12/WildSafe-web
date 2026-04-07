import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ReportIncident from './pages/ReportIncident';
import ThreatReport from './pages/ThreatReport';
import CaseManagement from './pages/CaseManagement';
import CaseDetails from './pages/CaseDetails';
import NotificationCenter from './pages/NotificationCenter';
import Analytics from './pages/Analytics';
import StaffManagement from './pages/StaffManagement';
import ResourceManagement from './pages/ResourceManagement';
import UserManagement from './pages/UserManagement';
import AdminLayout from './components/AdminLayout';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loading-state">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Admin Role Wrapper for Layout
const RoleBasedLayout = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') {
    return <AdminLayout>{children}</AdminLayout>;
  }
  return children;
};

// Role-based Dashboard Switcher
const DashboardSelector = () => {
  const { user } = useAuth();
  if (['OFFICER', 'ADMIN'].includes(user.role)) {
    return (
      <RoleBasedLayout>
        <OfficerDashboard />
      </RoleBasedLayout>
    );
  }
  return <CitizenDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardSelector />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <RoleBasedLayout>
                  <Profile />
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute roles={['CITIZEN']}>
                <ReportIncident />
              </ProtectedRoute>
            }
          />

          <Route
            path="/threat-report"
            element={
              <ProtectedRoute roles={['CITIZEN']}>
                <ThreatReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute roles={['OFFICER', 'ADMIN']}>
                <RoleBasedLayout>
                  <Analytics />
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />


          <Route
            path="/case-management"
            element={
              <ProtectedRoute roles={['OFFICER', 'ADMIN']}>
                <RoleBasedLayout>
                  <CaseManagement />
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cases/:caseId"
            element={
              <ProtectedRoute roles={['OFFICER', 'ADMIN']}>
                <RoleBasedLayout>
                  <CaseDetails />
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={['OFFICER', 'ADMIN']}>
                <RoleBasedLayout>
                  <NotificationCenter />
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <RoleBasedLayout>
                  <StaffManagement />
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <RoleBasedLayout>
                  <UserManagement />
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/resources"
            element={
              <ProtectedRoute roles={['OFFICER', 'ADMIN']}>
                <RoleBasedLayout>
                  <ResourceManagement />
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
