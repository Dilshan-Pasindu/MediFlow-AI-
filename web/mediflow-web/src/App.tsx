import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import type { UserRole } from './types/auth';

// Auth
import LoginPage from './pages/LoginPage';

// Patient
import DashboardPage from './pages/DashboardPage';
import FindDoctorPage from './pages/FindDoctorPage';
import SymptomAIPage from './pages/SymptomAIPage';
import DoctorBookingPage from './pages/DoctorBookingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

// Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ConsultationPage from './pages/doctor/ConsultationPage';

// Receptionist
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';

// Pharmacist
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';

// Pharmacy Owner
import OwnerDashboard from './pages/pharmacyowner/OwnerDashboard';

// Supplier
import SupplierDashboard from './pages/supplier/SupplierDashboard';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

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
    </BrowserRouter>
  );
}

export default App;
