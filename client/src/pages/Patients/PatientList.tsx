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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function PatientList() {
  const navigate = useNavigate();
  const [patients] = useState([]);

  const handleAddPatient = () => {
    navigate('/patients/new');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" component="h1">
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

        <TableContainer component={Paper}>
          <Table>
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
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient: any) => (
                <TableRow key={patient.id}>
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
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
