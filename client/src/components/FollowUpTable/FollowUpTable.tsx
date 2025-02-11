import { useState } from 'react';
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
  Typography
} from '@mui/material';
import { green, red } from '@mui/material/colors';

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
  '12 anos',
  '13 anos',
  '14 anos'
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
}

export const FollowUpTable: FC<FollowUpTableProps> = ({ patientId, onDataChange }) => {
  const [followUpData, setFollowUpData] = useState<Record<Period, FollowUpData>>({} as Record<Period, FollowUpData>);

  const handleChange = (period: Period, field: keyof FollowUpData, value: string | boolean) => {
    const newData = {
      ...followUpData,
      [period]: {
        ...followUpData[period],
        [field]: value
      }
    };
    setFollowUpData(newData);

    if (onDataChange) {
      onDataChange({
        patientId,
        followUp: newData
      });
    }
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mt: 2, 
        mb: 2,
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
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Exames</TableCell>
            <TableCell>Retorno</TableCell>
            <TableCell>
              <Typography variant="subtitle2">Comparecimento</Typography>
            </TableCell>
            <TableCell>Encaminhar exames</TableCell>
            <TableCell>Contato</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {periods.map((period) => (
            <TableRow key={period}>
              <TableCell>
                {period === '7 dias' || period === '30 dias' ? (
                  <Box sx={{ height: '56px' }} />
                ) : (
                  <TextField
                    size="small"
                    label={`Exames ${period}`}
                    variant="outlined"
                    fullWidth
                    value={followUpData[period]?.exams || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(period, 'exams', e.target.value)}
                  />
                )}
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  label={`Retorno ${period}`}
                  variant="outlined"
                  fullWidth
                  value={followUpData[period]?.returns || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(period, 'returns', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RadioGroup
                    row
                    value={followUpData[period]?.attendance || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(period, 'attendance', e.target.value as 'sim' | 'nao')}
                  >
                    <FormControlLabel
                      value="sim"
                      control={<GreenRadio size="small" />}
                      label={
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: followUpData[period]?.attendance === 'sim' ? green[600] : 'inherit',
                            fontWeight: followUpData[period]?.attendance === 'sim' ? 'bold' : 'normal'
                          }}
                        >
                          Sim
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="nao"
                      control={<RedRadio size="small" />}
                      label={
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: followUpData[period]?.attendance === 'nao' ? red[600] : 'inherit',
                            fontWeight: followUpData[period]?.attendance === 'nao' ? 'bold' : 'normal'
                          }}
                        >
                          Não
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </Box>
              </TableCell>
              <TableCell>
                {period === '7 dias' || period === '30 dias' ? (
                  <Box sx={{ height: '42px' }} />
                ) : (
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={followUpData[period]?.forwardExams || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(period, 'forwardExams', e.target.checked)}
                      />
                    }
                    label={period}
                  />
                )}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={followUpData[period]?.contact1 || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(period, 'contact1', e.target.checked)}
                      />
                    }
                    label="1"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={followUpData[period]?.contact2 || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(period, 'contact2', e.target.checked)}
                      />
                    }
                    label="2"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={followUpData[period]?.contact3 || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(period, 'contact3', e.target.checked)}
                      />
                    }
                    label="3"
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
