import { Routes, Route } from 'react-router-dom';
import { PatientList } from './pages/Patients/PatientList';
import { PatientForm } from './pages/Patients/PatientForm';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PatientList />} />
      <Route path="/patients" element={<PatientList />} />
      <Route path="/patients/new" element={<PatientForm />} />
      <Route path="/patients/:id/edit" element={<PatientForm />} />
      <Route path="/patients/:id" element={<PatientForm />} />
    </Routes>
  );
}
