import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './context/BrandingContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Residents from './pages/Residents';
import Rooms from './pages/Rooms';
import Attendance from './pages/Attendance';
import Visitors from './pages/Visitors';
import Mess from './pages/Mess';
import Complaints from './pages/Complaints';
import Notices from './pages/Notices';
import Fees from './pages/Fees';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <BrandingProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes wrapped in Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Layout />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/residents" element={<Residents />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/mess" element={<Mess />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrandingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
