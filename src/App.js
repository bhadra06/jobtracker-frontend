import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import ProfilePage from './pages/ProfilePage';
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
              <DashboardPage />
          </ProtectedRoute>
        } />
          <Route path="/analyze" element={
              <ProtectedRoute>
                  <AnalyzePage />
              </ProtectedRoute>
          } />
        <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/profile" element={
              <ProtectedRoute>
                  <ProfilePage />
              </ProtectedRoute>
          } />
      </Routes>
  );
}

export default function App() {
  return (
      <AuthProvider>

          <Toaster position="top-right" />
          <AppRoutes />

      </AuthProvider>
  );
}