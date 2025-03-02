import { useState, useCallback, useEffect } from 'react';
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
  Tooltip,
  Chip,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FollowUpTable } from '../../components/FollowUpTable/FollowUpTable';
import api from '../../services/api';

export function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Carregar lista de pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get<{ patients: any[] }>('/patients');
        setPatients(Array.isArray(response) ? response : response.patients || []);
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar lista de pacientes. Verifique sua conexão.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    navigate('/patients/new');
  };

  const handleEditPatient = (id: string) => {
    navigate(`/patients/edit/${id}`);
  };

  const handleViewPatient = (id: string) => {
    navigate(`/patients/view/${id}`);
  };

  const handleDeletePatient = async (id: string) => {
    try {
      await api.delete(`/patients/${id}`);
      setPatients(patients.filter(patient => patient._id !== id));
      setSnackbar({
        open: true,
        message: 'Paciente removido com sucesso',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao deletar paciente:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao remover paciente',
        severity: 'error'
      });
    }
  };

  const handleUpdateFollowUp = useCallback(async (patientId: string, followUpData: any) => {
    try {
      const response = await api.put(`/patients/${patientId}`, { followUpData });
      const updatedPatient = response.data;

      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient._id === patientId 
            ? { ...patient, followUpData: updatedPatient.followUpData }
            : patient
        )
      );

      setSnackbar({
        open: true,
        message: 'Dados de acompanhamento atualizados com sucesso',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao atualizar followUpData:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar dados de acompanhamento',
        severity: 'error'
      });
    }
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" color="primary">
          Pacientes
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer 
              sx={{ 
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
              }}
            >
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
                      <TableCell>
                        {patient.consultationDate}
                      </TableCell>
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
        </>
      )}
    </Container>
  );
}
