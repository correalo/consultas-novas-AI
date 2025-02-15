import { Routes, Route, Navigate } from 'react-router-dom';
import { PatientList } from './pages/Patients/PatientList';
import { PatientForm } from './pages/Patients/PatientForm';
import { PatientView } from './pages/Patients/PatientView';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/patients/list" replace />} />
      <Route path="/patients" element={<Navigate to="/patients/list" replace />} />
      <Route path="/patients/list" element={<PatientList />} />
      <Route path="/patients/view" element={<PatientView />} />
      <Route path="/patients/view/:id" element={<PatientView />} />
      <Route path="/patients/new" element={<PatientForm standalone />} />
    </Routes>
  );
}
