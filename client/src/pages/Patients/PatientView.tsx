import { Box, Paper, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { PatientForm } from './PatientForm';
import { FollowUpTable } from '../../components/FollowUpTable/FollowUpTable';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Period, FollowUpData } from '../../types/followUp';
import api from '../../services/api';

export function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if edit=true is in the query parameters
  const searchParams = new URLSearchParams(location.search);
  const editParam = searchParams.get('edit');
  
  const [isEditing, setIsEditing] = useState(editParam === 'true');
  const [openDialog, setOpenDialog] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [followUp, setFollowUp] = useState<Record<Period, FollowUpData>>({
    '7 dias': {},
    '30 dias': {},
    '90 dias': {},
    '3 meses': {},
    '6 meses': {},
    '9 meses': {},
    '12 meses': {},
    '15 meses': {},
    '18 meses': {},
    '2 anos': {},
    '3 anos': {},
    '4 anos': {},
    '5 anos': {},
    '6 anos': {},
    '7 anos': {},
    '8 anos': {},
    '9 anos': {},
    '10 anos': {},
    '11 anos': {},
    '12 anos': {},
    '13 anos': {},
    '14 anos': {},
    '15 anos': {}
  });
  const [classification, setClassification] = useState<string>('');
  const [surgeryDate, setSurgeryDate] = useState<string>('');

  // Carregar dados do paciente
  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        console.log('Fetching patient data for ID:', id);
        const data = await api.get(`/api/patients/${id}`);
        console.log('Received patient data:', data);
        
        // Se a API retornou um array, pegue o primeiro item
        const patientData = Array.isArray(data) ? data[0] : data;
        
        setPatient(patientData);
        setClassification(patientData.classification || '');
        setSurgeryDate(patientData.surgeryDate || '');
        if (patientData.followUp) {
          setFollowUp(prevFollowUp => ({
            ...prevFollowUp,
            ...patientData.followUp
          }));
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        // Adicione um snackbar ou outro feedback visual aqui
      }
    };

    fetchPatient();
  }, [id]);

  const handleFollowUpChange = (data: { patientId: string; followUp: Record<Period, FollowUpData> }) => {
    setFollowUp(data.followUp);
  };

  const handleSurgeryDateChange = (date: string) => {
    setSurgeryDate(date);
  };

  const handleClassificationChange = (newClassification: string) => {
    setClassification(newClassification);
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Update URL to include edit=true without navigating
    const newUrl = `${location.pathname}?edit=true`;
    window.history.pushState({}, '', newUrl);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Remove edit=true from URL without navigating
    window.history.pushState({}, '', location.pathname);
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (id) {
      try {
        await api.delete(`/api/patients/${id}`);
        navigate('/patients/list');
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
      }
    }
    setOpenDialog(false);
  };

  // Salvar dados do paciente
  const handleSave = async () => {
    if (!patient) return;

    try {
      await api.put(`/api/patients/${id}`, {
        ...patient,
        classification,
        surgeryDate,
        followUp
      });
      setIsEditing(false);
      // Remove edit=true from URL without navigating
      window.history.pushState({}, '', location.pathname);
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Detalhes do Paciente</Typography>
        <Box>
          {!isEditing ? (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{ mr: 1 }}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Excluir
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ mr: 1 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Salvar
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <PatientForm 
          onClassificationChange={handleClassificationChange} 
          onSurgeryDateChange={handleSurgeryDateChange}
          standalone={false}
          readOnly={!isEditing}
          initialData={patient}
        />
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <FollowUpTable 
          patientId={id || ''} 
          followUp={followUp}
          classification={classification}
          surgeryDate={surgeryDate}
          onDataChange={handleFollowUpChange}
          onSurgeryDateChange={handleSurgeryDateChange}
          readOnly={!isEditing}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
