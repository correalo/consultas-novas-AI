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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function MedicalRecordList() {
  const navigate = useNavigate();
  const [records] = useState([]);

  const handleAddRecord = () => {
    navigate('/medical-records/new');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Prontuários Médicos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRecord}
          >
            Novo Prontuário
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Data da Consulta</TableCell>
                <TableCell>Médico</TableCell>
                <TableCell>Diagnóstico</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell>{record.patientName}</TableCell>
                  <TableCell>{record.consultationDate}</TableCell>
                  <TableCell>{record.doctorName}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => navigate(`/medical-records/${record.id}`)}
                    >
                      Ver Detalhes
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
