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
        const response = await fetch('/api/patients');
        if (!response.ok) {
          throw new Error('Falha ao carregar pacientes');
        }
        const data = await response.json();
        setPatients(data.patients || data); // dependendo do formato da resposta
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar lista de pacientes',
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
    navigate(`/patients/view/${id}`);
  };

  const handleViewPatient = (id: string) => {
    navigate(`/patients/view/${id}`);
  };

  const handleDeletePatient = (id: string) => {
    // Implementar lógica de deleção
    console.log('Deletar paciente:', id);
  };

  const handleUpdateFollowUp = useCallback(async (patientId: string, followUpData: any) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followUpData }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar dados de acompanhamento');
      }

      const updatedPatient = await response.json();

      // Atualiza o estado local da lista de pacientes
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === patientId 
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
                maxHeight: 'calc(100vh - 180px)'  // Aumentando o espaço disponível
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
                  {patients.map((patient: any) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.cpf}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.625rem' }}>
                          {new Date(patient.consultationDate).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{patient.insuranceProvider}</TableCell>
                      <TableCell>{patient.insuranceType}</TableCell>
                      <TableCell>
                        {patient.classification === 'routine' && 'Rotina'}
                        {patient.classification === 'urgent' && 'Urgente'}
                        {patient.classification === 'followup' && 'Retorno'}
                        {patient.classification === 'pre-surgery' && 'Pré-cirúrgico'}
                        {patient.classification === 'post-surgery' && 'Pós-cirúrgico'}
                      </TableCell>
                      <TableCell>{patient.profession || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {patient.hospitals?.map((hospital: string) => (
                            <Chip
                              key={hospital}
                              label={hospital}
                              size="small"
                              sx={{ maxWidth: '100px' }}
                              title={hospital}
                            />
                          )) || '-'}
                        </Box>
                      </TableCell>
                      <TableCell>{patient.referral || '-'}</TableCell>
                      <TableCell>
                        {patient.observations ? (
                          <Tooltip title={patient.observations}>
                            <span>{patient.observations.substring(0, 50)}...</span>
                          </Tooltip>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Ver detalhes">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewPatient(patient.id)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditPatient(patient.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeletePatient(patient.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {patients.map((patient: any) => (
            <Box key={`followup-${patient.id}`} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Acompanhamento - {patient.name}
              </Typography>
              <FollowUpTable
                patientId={patient.id}
                followUp={patient.followUpData || {}}
                classification={patient.classification || ''}
                onDataChange={(data) => {
                  handleUpdateFollowUp(patient.id, data.followUp);
                }}
              />
            </Box>
          ))}
        </>
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
