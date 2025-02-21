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

// Componentes de radio button personalizados
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
  '90 dias',
  '6 meses',
  '9 meses',
  '12 meses',
  '15 meses',
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
  '12 anos',
  '13 anos',
  '14 anos',
  '15 anos'
] as const;

interface FollowUpData {
  exams?: string;
  returns?: string;
  attendance?: string;
  forwardExams?: boolean;
  contact1?: boolean;
  contact2?: boolean;
  contact3?: boolean;
  contact4?: boolean;
  contact5?: boolean;
}

interface FollowUpTableProps {
  patientId: string;
  onDataChange?: (data: { patientId: string; followUp: Record<string, FollowUpData> }) => void;
  followUp?: Record<string, FollowUpData>;
  surgeryDate?: string;
  onSurgeryDateChange?: (date: string) => void;
  classification?: string;
  readOnly?: boolean;
}

// Lista de feriados fixos (dd/mm)
const FIXED_HOLIDAYS = [
  '01/01', // Ano Novo
  '21/04', // Tiradentes
  '01/05', // Dia do Trabalho
  '07/09', // Independência
  '12/10', // Nossa Senhora
  '02/11', // Finados
  '15/11', // Proclamação da República
  '25/12', // Natal,
];

// Função para verificar se uma data é feriado
const isHoliday = (date: Date): boolean => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dateString = `${day}/${month}`;
  
  // Verifica feriados fixos
  if (FIXED_HOLIDAYS.includes(dateString)) {
    return true;
  }

  // Páscoa e feriados móveis (calculados para cada ano)
  const year = date.getFullYear();
  const easterDate = calculateEaster(year);
  const carnivalDate = new Date(easterDate);
  carnivalDate.setDate(easterDate.getDate() - 47); // Carnaval (terça)
  const corpusChristiDate = new Date(easterDate);
  corpusChristiDate.setDate(easterDate.getDate() + 60); // Corpus Christi

  const mobileDates = [
    easterDate,
    carnivalDate,
    corpusChristiDate,
  ];

  return mobileDates.some(holiday => 
    holiday.getDate() === date.getDate() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getFullYear() === date.getFullYear()
  );
};

// Função para calcular a data da Páscoa (Algoritmo de Meeus/Jones/Butcher)
const calculateEaster = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
};

const isValidDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  // 0 = Domingo, 2 = Terça, 5 = Sexta, 6 = Sábado
  return ![0, 2, 5, 6].includes(dayOfWeek) && !isHoliday(date);
};

const getNextValidDay = (date: Date): Date => {
  const nextDate = new Date(date);
  while (!isValidDay(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  return nextDate;
};

const calculateReturnDate = (surgeryDate: string, period: string): string => {
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

  // Ajusta para o próximo dia válido
  const validDate = getNextValidDay(returnDate);

  // Formatar a data como dd/mm/aaaa
  const day = validDate.getDate().toString().padStart(2, '0');
  const month = (validDate.getMonth() + 1).toString().padStart(2, '0');
  const year = validDate.getFullYear();

  return `${day}/${month}/${year}`;
};

const calculateExamDate = (returnDateStr: string): string => {
  const [day, month, year] = returnDateStr.split('/').map(Number);
  const returnDate = new Date(year, month - 1, day); // mês é 0-indexed
  const examDate = new Date(returnDate);
  
  // Subtrai 10 dias da data de retorno
  examDate.setDate(returnDate.getDate() - 10);

  // Formatar a data como dd/mm/aaaa
  const examDay = examDate.getDate().toString().padStart(2, '0');
  const examMonth = (examDate.getMonth() + 1).toString().padStart(2, '0');
  const examYear = examDate.getFullYear();

  return `${examDay}/${examMonth}/${examYear}`;
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
  const [followUpData, setFollowUpData] = useState<Record<string, FollowUpData>>(initialFollowUp);
  const [isExpanded, setIsExpanded] = useState(false);
  const isEnabled = classification === 'compareceu operado' && !readOnly;

  // Calculate return dates when surgery date changes
  useEffect(() => {
    if (surgeryDate && isEnabled) {
      const newData = { ...followUpData };
      
      periods.forEach(period => {
        const returnDate = calculateReturnDate(surgeryDate, period);
        newData[period] = {
          ...newData[period],
          returns: returnDate,
          exams: calculateExamDate(returnDate)
        };
      });
      
      setFollowUpData(newData);
      onDataChange?.({ patientId, followUp: newData });
    }
  }, [surgeryDate, isEnabled]);

  const handleChange = (period: string, field: keyof FollowUpData, value: string | boolean) => {
    if (!isEnabled) return;
    
    const newData = {
      ...followUpData,
      [period]: {
        ...followUpData[period],
        [field]: value,
      },
    };
    setFollowUpData(newData);
    onDataChange?.({ patientId, followUp: newData });
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          mb: 1
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <IconButton
          size="small"
          sx={{ 
            transform: isExpanded ? 'rotate(-180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s'
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
        <Typography variant="h6" component="div">
          Acompanhamento de Pós Operatório
        </Typography>
      </Box>
      <Collapse in={isExpanded}>
        <TableContainer component={Paper}>
          <Table size="small" sx={{
            '& .MuiTableRow-root:nth-of-type(odd)': {
              backgroundColor: '#f8f9fa',
            },
            '& .MuiTableRow-root:nth-of-type(even)': {
              backgroundColor: '#ffffff',
            },
            '& .MuiTableRow-root:hover': {
              backgroundColor: '#e8f4f8',
              transition: 'background-color 0.2s ease',
            },
            '& .MuiTableHead-root .MuiTableRow-root': {
              backgroundColor: '#eef1f4',
            },
            '& .MuiTableCell-root': {
              borderColor: '#e0e0e0',
            },
          }}>
            <TableHead>
              <TableRow>
                <TableCell>Exames</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Compareceu</TableCell>
                <TableCell>Encaminhar Exames</TableCell>
                <TableCell>Contatos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Linha da data da cirurgia */}
              <TableRow>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    Data da Cirurgia
                  </Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={surgeryDate}
                    onChange={(e) => onSurgeryDateChange?.(e.target.value)}
                    disabled={!isEnabled}
                    size="small"
                    sx={{ minWidth: '140px' }}
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
              {/* Linhas dos períodos */}
              {periods.map((period) => (
                <TableRow key={period}>
                  <TableCell>
                    {!['7 dias', '30 dias'].includes(period) ? (
                      <TextField
                        label={`Exames (${period})`}
                        value={followUpData[period]?.exams || ''}
                        onChange={(e) => handleChange(period, 'exams', e.target.value)}
                        disabled={!isEnabled}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <Box sx={{ height: '40px' }} /> // Espaçador para manter o alinhamento
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      label={`Retorno (${period})`}
                      value={followUpData[period]?.returns || ''}
                      onChange={(e) => handleChange(period, 'returns', e.target.value)}
                      disabled={!isEnabled}
                      size="small"
                      sx={{ minWidth: '140px' }}
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={followUpData[period]?.forwardExams || false}
                          onChange={(e) => handleChange(period, 'forwardExams', e.target.checked)}
                          disabled={!isEnabled}
                          size="small"
                        />
                      }
                      label={`Encaminhar (${period})`}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={followUpData[period]?.contact1 || false}
                            onChange={(e) => handleChange(period, 'contact1', e.target.checked)}
                            disabled={!isEnabled}
                            size="small"
                          />
                        }
                        label="1º"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={followUpData[period]?.contact2 || false}
                            onChange={(e) => handleChange(period, 'contact2', e.target.checked)}
                            disabled={!isEnabled}
                            size="small"
                          />
                        }
                        label="2º"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={followUpData[period]?.contact3 || false}
                            onChange={(e) => handleChange(period, 'contact3', e.target.checked)}
                            disabled={!isEnabled}
                            size="small"
                          />
                        }
                        label="3º"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={followUpData[period]?.contact4 || false}
                            onChange={(e) => handleChange(period, 'contact4', e.target.checked)}
                            disabled={!isEnabled}
                            size="small"
                          />
                        }
                        label="4º"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={followUpData[period]?.contact5 || false}
                            onChange={(e) => handleChange(period, 'contact5', e.target.checked)}
                            disabled={!isEnabled}
                            size="small"
                          />
                        }
                        label="5º"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};
