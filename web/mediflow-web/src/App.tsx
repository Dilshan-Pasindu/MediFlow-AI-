import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import type { UserRole } from './types/auth';

// Auth
const LoginPage = React.lazy(() => import('./pages/LoginPage'));

// Patient
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const FindDoctorPage = React.lazy(() => import('./pages/FindDoctorPage'));
const SymptomAIPage = React.lazy(() => import('./pages/SymptomAIPage'));
const DoctorBookingPage = React.lazy(() => import('./pages/DoctorBookingPage'));
const AppointmentsPage = React.lazy(() => import('./pages/AppointmentsPage'));
const AppointmentDetailsPage = React.lazy(() => import('./pages/AppointmentDetailsPage'));
const PrescriptionsPage = React.lazy(() => import('./pages/PrescriptionsPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Doctor
const DoctorDashboard = React.lazy(() => import('./pages/doctor/DoctorDashboard'));
const ConsultationPage = React.lazy(() => import('./pages/doctor/ConsultationPage'));

// Receptionist
const ReceptionistDashboard = React.lazy(() => import('./pages/receptionist/ReceptionistDashboard'));

// Pharmacist
const PharmacistDashboard = React.lazy(() => import('./pages/pharmacist/PharmacistDashboard'));

// Pharmacy Owner
const OwnerDashboard = React.lazy(() => import('./pages/pharmacyowner/OwnerDashboard'));

// Supplier
const SupplierDashboard = React.lazy(() => import('./pages/supplier/SupplierDashboard'));

// Admin
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));

// ─── Branded Loading Fallback ─────────────────────────────────────────────────

function LoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--med-bg, #F8FAFC)',
      gap: 16
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '3px solid rgba(14, 165, 233, 0.15)',
        borderTopColor: '#0EA5E9',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--med-text-secondary, #64748B)',
        letterSpacing: '0.02em'
      }}>
        Loading MediFlow...
      </span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Protected Route Wrapper ──────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: UserRole[];
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children;
}

function getRoleHome(role: UserRole): string {
  switch (role) {
    case 'Doctor':        return '/doctor/dashboard';
    case 'Receptionist':  return '/receptionist/dashboard';
    case 'Pharmacist':    return '/pharmacist/dashboard';
    case 'PharmacyOwner': return '/owner/dashboard';
    case 'Supplier':      return '/supplier/dashboard';
    case 'Administrator': return '/admin/dashboard';
    default:              return '/dashboard';
  }
}

// ─── Auto-redirect from / based on role ───────────────────────────────────────

function RootRedirect() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRoleHome(user.role)} replace />;
}

// ─── Main Application ─────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Patient Portal */}
          <Route path="/dashboard" element={<ProtectedRoute roles={['Patient']}><DashboardPage /></ProtectedRoute>} />
          <Route path="/find-doctor" element={<ProtectedRoute roles={['Patient']}><FindDoctorPage /></ProtectedRoute>} />
          <Route path="/symptom-check" element={<ProtectedRoute roles={['Patient']}><SymptomAIPage /></ProtectedRoute>} />
          <Route path="/doctors/:id/book" element={<ProtectedRoute roles={['Patient']}><DoctorBookingPage /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute roles={['Patient']}><AppointmentsPage /></ProtectedRoute>} />
          <Route path="/appointments/:id" element={<ProtectedRoute roles={['Patient']}><AppointmentDetailsPage /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute roles={['Patient']}><PrescriptionsPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute roles={['Patient']}><OrdersPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Doctor Portal */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['Doctor']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/appointments" element={<ProtectedRoute roles={['Doctor']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/consultation/:id" element={<ProtectedRoute roles={['Doctor']}><ConsultationPage /></ProtectedRoute>} />

          {/* Receptionist Portal */}
          <Route path="/receptionist/dashboard" element={<ProtectedRoute roles={['Receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />
          <Route path="/receptionist/queue" element={<ProtectedRoute roles={['Receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />

          {/* Pharmacist Portal */}
          <Route path="/pharmacist/dashboard" element={<ProtectedRoute roles={['Pharmacist']}><PharmacistDashboard /></ProtectedRoute>} />
          <Route path="/pharmacist/prescriptions" element={<ProtectedRoute roles={['Pharmacist']}><PharmacistDashboard /></ProtectedRoute>} />
          <Route path="/pharmacist/orders" element={<ProtectedRoute roles={['Pharmacist']}><PharmacistDashboard /></ProtectedRoute>} />

          {/* Pharmacy Owner Portal */}
          <Route path="/owner/dashboard" element={<ProtectedRoute roles={['PharmacyOwner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/inventory" element={<ProtectedRoute roles={['PharmacyOwner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/restock" element={<ProtectedRoute roles={['PharmacyOwner']}><OwnerDashboard /></ProtectedRoute>} />

          {/* Supplier Portal */}
          <Route path="/supplier/dashboard" element={<ProtectedRoute roles={['Supplier']}><SupplierDashboard /></ProtectedRoute>} />
          <Route path="/supplier/requests" element={<ProtectedRoute roles={['Supplier']}><SupplierDashboard /></ProtectedRoute>} />

          {/* Admin Portal */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['Administrator']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['Administrator']}><AdminDashboard /></ProtectedRoute>} />

          {/* 404 / Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
