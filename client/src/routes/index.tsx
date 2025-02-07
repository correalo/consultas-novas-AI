import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { PatientList } from '../pages/Patients/PatientList';
import { PatientForm } from '../pages/Patients/PatientForm';
import { MedicalRecordList } from '../pages/MedicalRecords/MedicalRecordList';
import { MedicalRecordForm } from '../pages/MedicalRecords/MedicalRecordForm';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rotas privadas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Navigate to="/dashboard" />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <PatientList />
          </PrivateRoute>
        }
      />

      <Route
        path="/patients/new"
        element={
          <PrivateRoute>
            <PatientForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/patients/:id"
        element={
          <PrivateRoute>
            <PatientForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/medical-records"
        element={
          <PrivateRoute>
            <MedicalRecordList />
          </PrivateRoute>
        }
      />

      <Route
        path="/medical-records/new"
        element={
          <PrivateRoute>
            <MedicalRecordForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/medical-records/:id"
        element={
          <PrivateRoute>
            <MedicalRecordForm />
          </PrivateRoute>
        }
      />

      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
