import { Box, Paper, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { PatientForm } from './PatientForm';
import { FollowUpTable } from '../../components/FollowUpTable/FollowUpTable';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

type Period = '7 dias' | '30 dias' | '3 meses' | '6 meses' | '9 meses' | '12 meses' | '18 meses' | '2 anos' | '3 anos' | '4 anos' | '5 anos' | '6 anos' | '7 anos' | '8 anos' | '9 anos' | '10 anos' | '11 anos';

type FollowUpData = {
  exams?: string;
  returns?: string;
  attendance?: 'sim' | 'nao';
  forwardExams?: boolean;
  contact1?: boolean;
  contact2?: boolean;
  contact3?: boolean;
};

export function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [followUp, setFollowUp] = useState<Record<Period, FollowUpData>>({
    '7 dias': {},
    '30 dias': {},
    '3 meses': {},
    '6 meses': {},
    '9 meses': {},
    '12 meses': {},
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
    '11 anos': {}
  });
  const [classification, setClassification] = useState<string>('');
  const [surgeryDate, setSurgeryDate] = useState<string>('');

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
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (id) {
      try {
        const response = await fetch(`/api/patients/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Falha ao deletar paciente');
        }

        navigate('/patients/list');
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
      }
    }
    setOpenDialog(false);
  };

  const handleSave = async () => {
    // Implementar a lógica de salvar
    setIsEditing(false);
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
        <DialogTitle>Confirmar exclusão</DialogTitle>
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
