import { useState, useEffect } from 'react';
import { Period, FollowUpData } from '../../types/followUp';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Radio,
  RadioGroup,
  styled,
  Typography,
  IconButton,
  Collapse,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format, parse } from 'date-fns';
import { green, red } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { isValidDisplayFormat } from '../../utils/dateFormatUtils';

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

const periods: Period[] = [
  '7 dias',
  '30 dias',
  '3 meses',
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
];

interface FollowUpTableProps {
  patientId: string;
  followUp: Record<Period, FollowUpData>;
  onDataChange?: (data: { patientId: string; followUp: Record<Period, FollowUpData> }) => void;
  surgeryDate?: string;
  onSurgeryDateChange?: (date: string) => void;
  classification?: string;
  readOnly?: boolean;
}

// Função para verificar se uma data é feriado
const isHoliday = (date: Date): boolean => {
  // Implementação básica para feriados nacionais fixos
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Lista de feriados nacionais fixos (dia/mês)
  const fixedHolidays = [
    { day: 1, month: 1 },   // Ano Novo
    { day: 21, month: 4 },  // Tiradentes
    { day: 1, month: 5 },   // Dia do Trabalho
    { day: 7, month: 9 },   // Independência
    { day: 12, month: 10 }, // Nossa Senhora Aparecida
    { day: 2, month: 11 },  // Finados
    { day: 15, month: 11 }, // Proclamação da República
    { day: 25, month: 12 }, // Natal
  ];

  return fixedHolidays.some(holiday => holiday.day === day && holiday.month === month);
};

const isValidDay = (date: Date): boolean => {
  const day = date.getDay(); // 0 = Domingo, 5 = Sexta, 6 = Sábado
  return day !== 0 && day !== 5 && day !== 6 && !isHoliday(date); // Exclui domingo, sexta e sábado
};

const getNextValidDay = (date: Date): Date => {
  const nextDate = new Date(date);
  while (!isValidDay(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  return nextDate;
};

const getPreviousValidDay = (date: Date): Date => {
  const prevDate = new Date(date);
  while (!isValidDay(prevDate)) {
    prevDate.setDate(prevDate.getDate() - 1);
  }
  return prevDate;
};

const calculateReturnDate = (surgeryDate: string, period: Period): string => {
  console.log('calculateReturnDate chamado:', { surgeryDate, period });
  
  if (!surgeryDate) {
    console.log('Data da cirurgia vazia');
    return '';
  }

  const [day, month, year] = surgeryDate.split('/').map(Number);
  console.log('Partes da data:', { day, month, year });
  
  if (!day || !month || !year) {
    console.error('Data de cirurgia inválida:', surgeryDate);
    return '';
  }

  const date = new Date(year, month - 1, day);
  console.log('Data inicial:', date.toISOString());
  
  const newDate = new Date(date);
  const numericValue = period.match(/\d+/)?.[0];
  
  if (!numericValue) {
    console.error('Não foi possível extrair valor numérico do período:', period);
    return '';
  }

  const value = parseInt(numericValue);
  console.log('Valor extraído:', value);

  if (period.includes('dias')) {
    newDate.setDate(date.getDate() + value);
  } else if (period.includes('meses') || period.includes('mes')) {
    newDate.setMonth(date.getMonth() + value);
  } else if (period.includes('anos') || period.includes('ano')) {
    newDate.setFullYear(date.getFullYear() + value);
  } else {
    // Se não encontrar nenhum dos padrões acima, assume que é em meses
    newDate.setMonth(date.getMonth() + value);
  }

  console.log('Data após cálculo inicial:', newDate.toISOString());

  // Encontra o próximo dia válido (não é feriado nem fim de semana)
  const validDate = getNextValidDay(newDate);
  console.log('Data após validação:', validDate.toISOString());
  
  // Formata a data de retorno
  const returnDay = validDate.getDate().toString().padStart(2, '0');
  const returnMonth = (validDate.getMonth() + 1).toString().padStart(2, '0');
  const returnYear = validDate.getFullYear();
  
  const result = `${returnDay}/${returnMonth}/${returnYear}`;
  console.log('Data de retorno formatada:', result);
  
  return result;
};

const calculateExamDate = (returnDateStr: string): string => {
  console.log('calculateExamDate chamado:', { returnDateStr });
  
  if (!returnDateStr) {
    console.log('Data de retorno vazia');
    return '';
  }

  const [day, month, year] = returnDateStr.split('/').map(Number);
  console.log('Partes da data:', { day, month, year });
  
  if (!day || !month || !year) {
    console.error('Data de retorno inválida:', returnDateStr);
    return '';
  }

  const returnDate = new Date(year, month - 1, day);
  console.log('Data de retorno:', returnDate.toISOString());
  
  const examDate = new Date(returnDate);
  examDate.setDate(returnDate.getDate() - 10);
  console.log('Data do exame inicial:', examDate.toISOString());

  // Encontra o dia útil anterior se necessário
  const validDate = getPreviousValidDay(examDate);
  console.log('Data do exame após validação:', validDate.toISOString());

  // Formatar a data como dd/mm/aaaa
  const examDay = validDate.getDate().toString().padStart(2, '0');
  const examMonth = (validDate.getMonth() + 1).toString().padStart(2, '0');
  const examYear = validDate.getFullYear();

  const result = `${examDay}/${examMonth}/${examYear}`;
  console.log('Data do exame formatada:', result);
  
  return result;
};

export function FollowUpTable({ 
  patientId, 
  followUp,
  onDataChange,
  surgeryDate = '',
  onSurgeryDateChange,
  classification,
  readOnly = false
}: FollowUpTableProps) {
  console.log('FollowUpTable renderizado:', { surgeryDate, classification, readOnly });
  
  const [followUpData, setFollowUpData] = useState<Record<Period, FollowUpData>>(followUp);
  const [isExpanded, setIsExpanded] = useState(false);
  const isEnabled = classification === 'compareceu operado' && !readOnly;

  // Calculate return dates when surgery date changes
  useEffect(() => {
    console.log('useEffect FollowUpTable:', {
      surgeryDate,
      isEnabled,
      classification,
      followUpData
    });
    
    if (!surgeryDate || !isEnabled) {
      console.log('Condições não atendidas:', {
        temDataCirurgia: !!surgeryDate,
        estaHabilitado: isEnabled
      });
      return;
    }

    // Validar formato da data (dd/mm/yyyy)
    if (!isValidDisplayFormat(surgeryDate)) {
      console.error('Data da cirurgia em formato inválido:', surgeryDate);
      return;
    }

    const calculateDates = () => {
      console.log('Iniciando cálculo de datas para data de cirurgia:', surgeryDate);
      const newData = { ...followUpData };
      let hasChanges = false;

      periods.forEach(period => {
        console.log(`\nProcessando período: ${period}`);
        const returnDate = calculateReturnDate(surgeryDate, period);
        console.log('Data de retorno calculada:', returnDate);
        
        if (returnDate) {
          hasChanges = true;
          const examDate = calculateExamDate(returnDate);
          console.log('Data do exame calculada:', examDate);
          
          newData[period] = {
            ...newData[period],
            returns: returnDate,
            exams: examDate
          };
        }
      });

      if (hasChanges) {
        console.log('Atualizando dados com novas datas:', newData);
        setFollowUpData(newData);
        onDataChange?.({ patientId, followUp: newData });
      }
    };

    // Adiciona um pequeno delay para garantir que a data está no formato correto
    const timer = setTimeout(calculateDates, 100);
    return () => clearTimeout(timer);
  }, [surgeryDate, isEnabled, patientId, onDataChange]);

  const handleChange = (period: Period, field: keyof FollowUpData, value: string | boolean) => {
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
              padding: '4px 8px',
              borderColor: '#e0e0e0',
              whiteSpace: 'nowrap',
              fontSize: '0.8rem'
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
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                    Data da Cirurgia
                  </Typography>
                </TableCell>
                <TableCell>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                      value={surgeryDate ? parse(surgeryDate, 'dd/MM/yyyy', new Date()) : null}
                      onChange={(newValue) => {
                        if (newValue) {
                          const formattedDate = format(newValue, 'dd/MM/yyyy');
                          onSurgeryDateChange?.(formattedDate);
                        }
                      }}
                      disabled={!isEnabled}
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: { 
                            width: '150px !important',
                            '& .MuiInputLabel-root': {
                              display: 'none'
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '0.8rem',
                              padding: '8px',
                            }
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
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
                        sx={{ 
                          width: '120px',
                          '& .MuiInputLabel-root': {
                            fontSize: '0.8rem',
                          },
                          '& .MuiInputBase-input': {
                            fontSize: '0.8rem',
                            padding: '8px',
                          }
                        }}
                      />
                    ) : (
                      <Box sx={{ width: '120px' }} /> // Espaçador para manter o alinhamento
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      label={`Retorno (${period})`}
                      value={followUpData[period]?.returns || ''}
                      onChange={(e) => handleChange(period, 'returns', e.target.value)}
                      disabled={!isEnabled}
                      size="small"
                      sx={{ 
                        width: '120px',
                        '& .MuiInputLabel-root': {
                          fontSize: '0.8rem',
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '0.8rem',
                          padding: '8px',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      value={followUpData[period]?.attendance || ''}
                      onChange={(e) => handleChange(period, 'attendance', e.target.value)}
                      sx={{ 
                        '& .MuiFormControlLabel-root': {
                          marginRight: 0.5,
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.8rem'
                          }
                        }
                      }}
                    >
                      <FormControlLabel
                        value="sim"
                        control={<GreenRadio size="small" />}
                        label="Sim"
                        disabled={!isEnabled}
                      />
                      <FormControlLabel
                        value="nao"
                        control={<RedRadio size="small" />}
                        label="Não"
                        disabled={!isEnabled}
                      />
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    {period !== '7 dias' && period !== '30 dias' && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={followUpData[period]?.forwardExams || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleChange(period, 'forwardExams', e.target.checked)
                            }
                            disabled={!isEnabled}
                            size="small"
                          />
                        }
                        label={`Encaminhar (${period})`}
                        sx={{ 
                          marginRight: 0,
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.8rem'
                          }
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      gap: 0.5,
                      flexWrap: 'nowrap',
                      '& .MuiFormControlLabel-root': {
                        marginRight: 0,
                        marginLeft: 0,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap'
                        }
                      }
                    }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={followUpData[period]?.contact1 || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleChange(period, 'contact1', e.target.checked)
                            }
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleChange(period, 'contact2', e.target.checked)
                            }
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleChange(period, 'contact3', e.target.checked)
                            }
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleChange(period, 'contact4', e.target.checked)
                            }
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleChange(period, 'contact5', e.target.checked)
                            }
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
