import { useState } from 'react';
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
  const [patients] = useState([]);

  const handleAddPatient = () => {
    navigate('/patients/new');
  };

  const handleEditPatient = (id: string) => {
    navigate(`/patients/${id}/edit`);
  };

  const handleViewPatient = (id: string) => {
    navigate(`/patients/${id}`);
  };

  const handleDeletePatient = (id: string) => {
    // Implementar lógica de deleção
    console.log('Deletar paciente:', id);
  };

  return (
    <Container maxWidth="lg">
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

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer 
          sx={{ 
            backgroundColor: '#e8e8e8',
            '& .MuiTableHead-root': {
              '& .MuiTableCell-root': {
                backgroundColor: '#e8e8e8',
                fontWeight: 600,
              }
            },
            '& .MuiTableBody-root .MuiTableRow-root:hover': {
              backgroundColor: '#e0e0e0',
            },
            maxHeight: 'calc(100vh - 240px)'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Data da Consulta</TableCell>
                <TableCell>Convênio</TableCell>
                <TableCell>Tipo de Plano</TableCell>
                <TableCell>Classificação</TableCell>
                <TableCell>Data da Cirurgia</TableCell>
                <TableCell>Hospitais</TableCell>
                <TableCell>Indicação</TableCell>
                <TableCell>Observações</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient: any) => (
                <TableRow key={patient.id} hover>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.cpf}</TableCell>
                  <TableCell>{new Date(patient.consultationDate).toLocaleString()}</TableCell>
                  <TableCell>{patient.insuranceProvider}</TableCell>
                  <TableCell>{patient.insuranceType}</TableCell>
                  <TableCell>
                    {patient.classification === 'routine' && 'Rotina'}
                    {patient.classification === 'urgent' && 'Urgente'}
                    {patient.classification === 'followup' && 'Retorno'}
                    {patient.classification === 'pre-surgery' && 'Pré-cirúrgico'}
                    {patient.classification === 'post-surgery' && 'Pós-cirúrgico'}
                  </TableCell>
                  <TableCell>
                    {patient.surgeryDate ? new Date(patient.surgeryDate).toLocaleDateString() : '-'}
                  </TableCell>
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
        <Box key={`followup-${patient.id}`} sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Acompanhamento - {patient.name}
          </Typography>
          <FollowUpTable
            patientId={patient.id}
            onDataChange={(data) => {
              console.log('Follow-up data changed:', data);
              // Implementar lógica para salvar os dados
            }}
          />
        </Box>
      ))}
    </Container>
  );
}
