import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Patient {
  _id: string;
  name: string;
  cpf: string;
  consultationDate?: string;
  insuranceProvider?: string;
  insuranceType?: string;
  classification?: string;
  profession?: string;
  hospitals?: string[];
  referral?: string;
  observations?: string;
}

export function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchPatients = useCallback(async () => {
    if (!isMounted) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Patient[]>('/api/patients');
      if (isMounted) {
        setPatients(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      if (isMounted) {
        setError('Não foi possível carregar a lista de pacientes. Por favor, verifique sua conexão e tente novamente.');
        // Tentar reconectar após 5 segundos
        setTimeout(() => {
          if (isMounted) {
            fetchPatients();
          }
        }, 5000);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    fetchPatients();
    return () => {
      setIsMounted(false);
    };
  }, [fetchPatients]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddPatient = () => {
    navigate('/patients/new');
  };

  const handleEditPatient = (id: string) => {
    navigate(`/patients/${id}/edit`);
  };

  const handleViewPatient = (id: string) => {
    navigate(`/patients/${id}`);
  };

  const handleDeletePatient = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este paciente?')) {
      return;
    }

    try {
      await api.delete(`/api/patients/${id}`);
      setSnackbar({
        open: true,
        message: 'Paciente excluído com sucesso',
        severity: 'success'
      });
      fetchPatients();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao excluir paciente',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        gap: 2 
      }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => fetchPatients()}
          startIcon={<RefreshIcon />}
        >
          Tentar Novamente
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Lista de Pacientes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddPatient}
        >
          Novo Paciente
        </Button>
      </Box>

      {patients.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          gap: 2,
          p: 4 
        }}>
          <Typography>Nenhum paciente cadastrado</Typography>
          <Button
            variant="contained"
            onClick={handleAddPatient}
            startIcon={<AddIcon />}
          >
            Cadastrar Primeiro Paciente
          </Button>
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ 
            backgroundColor: '#e8e8e8',
            '& .MuiTableHead-root': {
              '& .MuiTableCell-root': {
                backgroundColor: '#e8e8e8',
                fontWeight: 600,
                padding: '8px 16px',
                whiteSpace: 'nowrap'
              }
            },
            '& .MuiTableBody-root': {
              '& .MuiTableCell-root': {
                padding: '8px 16px',
                whiteSpace: 'nowrap'
              }
            },
            '& .MuiTableBody-root .MuiTableRow-root:hover': {
              backgroundColor: '#e0e0e0',
            },
            maxHeight: 'calc(100vh - 180px)'
          }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: '250px' }}>Nome</TableCell>
                  <TableCell sx={{ minWidth: '120px' }}>CPF</TableCell>
                  <TableCell sx={{ minWidth: '150px' }}>Data da Consulta</TableCell>
                  <TableCell sx={{ minWidth: '120px' }}>Convênio</TableCell>
                  <TableCell sx={{ minWidth: '120px' }}>Tipo de Plano</TableCell>
                  <TableCell sx={{ minWidth: '120px' }}>Classificação</TableCell>
                  <TableCell sx={{ minWidth: '120px' }}>Profissão</TableCell>
                  <TableCell sx={{ minWidth: '150px' }}>Hospitais</TableCell>
                  <TableCell sx={{ minWidth: '120px' }}>Indicação</TableCell>
                  <TableCell sx={{ minWidth: '200px' }}>Observações</TableCell>
                  <TableCell align="center" sx={{ minWidth: '120px' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient._id} hover>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.cpf}</TableCell>
                    <TableCell>{patient.consultationDate}</TableCell>
                    <TableCell>{patient.insuranceProvider}</TableCell>
                    <TableCell>{patient.insuranceType}</TableCell>
                    <TableCell>{patient.classification}</TableCell>
                    <TableCell>{patient.profession}</TableCell>
                    <TableCell>{patient.hospitals?.join(', ')}</TableCell>
                    <TableCell>{patient.referral}</TableCell>
                    <TableCell>{patient.observations}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewPatient(patient._id)}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditPatient(patient._id)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePatient(patient._id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
