import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import VideosPage from './pages/VideosPage';
import PostsPage from './pages/PostsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import BookingPage from './pages/BookingPage';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminWorkingHours from './pages/AdminWorkingHours';
import AdminCMS from './pages/AdminCMS';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/working-hours"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminWorkingHours />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cms"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminCMS />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
