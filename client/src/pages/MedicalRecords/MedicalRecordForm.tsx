import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function MedicalRecordForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    consultationDate: '',
    symptoms: '',
    diagnosis: '',
    prescription: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar a lógica de salvar
    navigate('/medical-records');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Novo Prontuário
        </Typography>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="ID do Paciente"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="datetime-local"
                  label="Data da Consulta"
                  name="consultationDate"
                  value={formData.consultationDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Sintomas"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Diagnóstico"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Prescrição"
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observações"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/medical-records')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained">
                    Salvar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
