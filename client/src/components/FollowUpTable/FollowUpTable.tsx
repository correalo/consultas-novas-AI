import { useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Radio,
  RadioGroup,
  styled,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const GreenRadio = styled(Radio)({
  '&.Mui-checked': {
    color: green[600],
  },
});

const RedRadio = styled(Radio)({
  '&.Mui-checked': {
    color: red[600],
  },
});

const periods = [
  '7 dias',
  '30 dias',
  '3 meses',
  '6 meses',
  '9 meses',
  '12 meses',
  '18 meses',
  '2 anos',
  '3 anos',
  '4 anos',
  '5 anos',
  '6 anos',
  '7 anos',
  '8 anos',
  '9 anos',
  '10 anos',
  '11 anos',
] as const;

type Period = typeof periods[number];

interface FollowUpData {
  exams?: string;
  returns?: string;
  attendance?: 'sim' | 'nao';
  forwardExams?: boolean;
  contact1?: boolean;
  contact2?: boolean;
  contact3?: boolean;
}

interface FollowUpTableProps {
  patientId: string;
  onDataChange?: (data: { patientId: string; followUp: Record<Period, FollowUpData> }) => void;
  followUp: Record<Period, FollowUpData>;
  surgeryDate?: string;
  onSurgeryDateChange?: (date: string) => void;
  classification: string;
  readOnly?: boolean;
}

const calculateReturnDate = (surgeryDate: string, period: Period): string => {
  const surgeryDateObj = new Date(surgeryDate);
  const returnDate = new Date(surgeryDateObj);

  // Parse the period string to get the number and unit
  const [amount, unit] = period.split(' ');
  const numericAmount = parseInt(amount);

  switch (unit) {
    case 'dias':
      returnDate.setDate(surgeryDateObj.getDate() + numericAmount);
      break;
    case 'meses':
      returnDate.setMonth(surgeryDateObj.getMonth() + numericAmount);
      break;
    case 'anos':
      returnDate.setFullYear(surgeryDateObj.getFullYear() + numericAmount);
      break;
    default:
      break;
  }

  return returnDate.toISOString().split('T')[0];
};

export function FollowUpTable({ 
  patientId, 
  onDataChange,
  followUp: initialFollowUp = {},
  surgeryDate = '',
  onSurgeryDateChange,
  classification,
  readOnly = false
}: FollowUpTableProps) {
  const [followUpData, setFollowUpData] = useState<Record<Period, FollowUpData>>(initialFollowUp as Record<Period, FollowUpData>);
  const [isExpanded, setIsExpanded] = useState(false);
  const isEnabled = classification === 'compareceu operado' && !readOnly;

  // Calculate return dates when surgery date changes
  useEffect(() => {
    if (surgeryDate && isEnabled) {
      const newData = { ...followUpData };
      
      periods.forEach(period => {
        newData[period] = {
          ...newData[period],
          returns: calculateReturnDate(surgeryDate, period)
        };
      });

      setFollowUpData(newData);
      onDataChange?.({ patientId, followUp: newData });
    }
  }, [surgeryDate, isEnabled]);

  const handleChange = (period: Period, field: keyof FollowUpData, value: string | boolean) => {
    if (!isEnabled) return;
    
    const newData = {
      ...followUpData,
      [period]: {
        ...followUpData[period],
        [field]: value
      }
    };
    setFollowUpData(newData);
    onDataChange?.({ patientId, followUp: newData });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Typography variant="h6" component="div">
            Acompanhamento
          </Typography>
          <TextField
            label="Data da Cirurgia"
            type="date"
            value={surgeryDate}
            onChange={(e) => {
              onSurgeryDateChange?.(e.target.value);
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ width: 200 }}
            disabled={!isEnabled}
          />
        </Box>
        <Box />
      </Box>

      <Collapse in={isExpanded}>
        <TableContainer sx={{
          mt: 2,
          mb: 2,
          opacity: isEnabled ? 1 : 0.7,
          pointerEvents: isEnabled ? 'auto' : 'none',
          backgroundColor: '#e8e8e8',
          '& .MuiTableRow-root': {
            '&:nth-of-type(odd)': {
              backgroundColor: '#e8e8e8',
            },
            '&:hover': {
              backgroundColor: '#e8e8e8',
            },
          },
          '& .MuiTableHead-root': {
            '& .MuiTableRow-root': {
              backgroundColor: '#e8e8e8',
            }
          }
        }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Período</TableCell>
                <TableCell>Exames</TableCell>
                <TableCell>Retorno</TableCell>
                <TableCell>Compareceu</TableCell>
                <TableCell>Encaminhar Exames</TableCell>
                <TableCell>Contato 1</TableCell>
                <TableCell>Contato 2</TableCell>
                <TableCell>Contato 3</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period}>
                  <TableCell>{period}</TableCell>
                  <TableCell>
                    <TextField
                      value={followUpData[period]?.exams || ''}
                      onChange={(e) => handleChange(period, 'exams', e.target.value)}
                      disabled={!isEnabled}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={followUpData[period]?.returns || ''}
                      onChange={(e) => handleChange(period, 'returns', e.target.value)}
                      disabled={!isEnabled}
                    />
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      value={followUpData[period]?.attendance || ''}
                      onChange={(e) => handleChange(period, 'attendance', e.target.value)}
                    >
                      <FormControlLabel
                        value="sim"
                        control={<GreenRadio size="small" disabled={!isEnabled} />}
                        label="Sim"
                      />
                      <FormControlLabel
                        value="nao"
                        control={<RedRadio size="small" disabled={!isEnabled} />}
                        label="Não"
                      />
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={followUpData[period]?.forwardExams || false}
                      onChange={(e) => handleChange(period, 'forwardExams', e.target.checked)}
                      disabled={!isEnabled}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={followUpData[period]?.contact1 || false}
                      onChange={(e) => handleChange(period, 'contact1', e.target.checked)}
                      disabled={!isEnabled}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={followUpData[period]?.contact2 || false}
                      onChange={(e) => handleChange(period, 'contact2', e.target.checked)}
                      disabled={!isEnabled}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={followUpData[period]?.contact3 || false}
                      onChange={(e) => handleChange(period, 'contact3', e.target.checked)}
                      disabled={!isEnabled}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
};
