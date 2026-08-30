import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FindDoctorPage from './pages/FindDoctorPage';
import DoctorBookingPage from './pages/DoctorBookingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/find-doctor" element={<FindDoctorPage />} />
        <Route path="/doctors/:id/book" element={<DoctorBookingPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
        <Route path="/prescriptions" element={<PrescriptionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
