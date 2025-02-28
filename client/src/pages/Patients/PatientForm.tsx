import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  IconButton,
  InputAdornment
} from '@mui/material';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCPF, validateCPF } from '../../utils/cpfValidator';
import { useTheme, useMediaQuery } from '@mui/material';
import { toDisplayDateFormat } from '../../utils/dateFormatUtils';

const HOSPITALS = [
  'Nenhum',
  'HAOC',
  'H. Santa Catarina',
  'Lefort Liberdade',
  'Lefort Morumbi',
  'HCor',
  'HIAE',
  'HSL',
  'H. Santa Paula',
  'IGESP',
] as const;

const HOSPITALS_ROW1 = HOSPITALS.slice(0, 5);
const HOSPITALS_ROW2 = HOSPITALS.slice(5);

const PROFESSIONS = [
  'ADMINISTRADOR(A)',
  'ADVOGADO(A)',
  'AGRICULTOR(A)',
  'APOSENTADO(A)',
  'ARQUITETO(A)',
  'ARTISTA',
  'ASSISTENTE SOCIAL',
  'AUTÔNOMO(A)',
  'BANCÁRIO(A)',
  'BIBLIOTECÁRIO(A)',
  'COMERCIANTE',
  'CONTADOR(A)',
  'DENTISTA',
  'DESIGNER',
  'DO LAR',
  'ECONOMISTA',
  'EMPRESÁRIO(A)',
  'ENFERMEIRO(A)',
  'ENGENHEIRO(A)',
  'ESTUDANTE',
  'FARMACÊUTICO(A)',
  'FISIOTERAPEUTA',
  'FUNCIONÁRIO(A) PÚBLICO(A)',
  'JORNALISTA',
  'MÉDICO(A)',
  'MOTORISTA',
  'NUTRICIONISTA',
  'PEDAGOGO(A)',
  'PROFESSOR(A)',
  'PROGRAMADOR(A)',
  'PSICÓLOGO(A)',
  'PUBLICITÁRIO(A)',
  'SECRETÁRIO(A)',
  'TÉCNICO(A)',
  'VENDEDOR(A)',
  'OUTROS'
] as const;

const INSURANCE_SUBTYPES: { [key: string]: string[] } = {
  'amil': [
    'AMIL 140 PLUS',
    'AMIL 160',
    'AMIL BLUE I',
    'AMIL BLUE II',
    'AMIL GLOBAL I',
    'AMIL 30',
    'AMIL 40',
    'AMIL 200',
    'AMIL 300',
    'AMIL 400',
    'AMIL 500',
    'AMIL 700',
    'AMIL BLUE GOLD',
    'AMIL FACIL S60 SP',
    'AMIL COLABORADOR',
    'AMIL ORIENTADOR 40',
    'AMIL ORIENTADOR 140',
    'AMIL NEXT MUN SAO PAULO',
    'AMIL QUALITE M22',
    'AMIL ONE S1500',
    'AMIL ONE S2500',
    'AMIL OPCAO M22',
    'AMIL SANTA PAULA'
  ],
  'bradesco': [
    'NACIONAL FLEX',
    'NACIONAL PLUS',
    'NACIONAL TOP',
    'SAUDE TOP NACIONAL',
    'SAUDE EFETIVO III',
    'SAUDE EFETIVO II',
    'SAUDE EFETIVO I',
    'REDE NACIONAL FLEX',
    'REDE NACIONAL PLUS',
    'REDE NACIONAL TOP',
    'REDE PREFERENCIAL',
    'REDE PREFERENCIAL PLUS'
  ],
  'sulamerica': [
    'BASICO 10',
    'BASICO 20',
    'ESPECIAL 100',
    'EXECUTIVO',
    'PRESTIGE',
    'CLASSICO',
    'EXECUTIVO PLUS',
    'PRESTIGE PLUS'
  ],
  'unimed': [
    'UNIMED ALPHA',
    'UNIMED BETA',
    'UNIMED DELTA',
    'UNIMED OMEGA',
    'UNIMED FESP',
    'UNIMED GUARULHOS',
    'UNIMED SEGUROS'
  ],
  'cassi': [
    'PLANO ASSOCIADOS',
    'PLANO FAMILIA'
  ],
  'notredame': [
    'NOTREDAME BASICO',
    'NOTREDAME PLUS',
    'NOTREDAME PREMIUM'
  ],
  'mediservice': [
    'MEDISERVICE BASICO',
    'MEDISERVICE PLUS',
    'MEDISERVICE PREMIUM'
  ],
  'goldencross': [
    'GOLDEN CROSS BASICO',
    'GOLDEN CROSS PLUS',
    'GOLDEN CROSS PREMIUM'
  ],
  'portoseguro': [
    'PORTO SEGURO BASICO',
    'PORTO SEGURO PLUS',
    'PORTO SEGURO PREMIUM'
  ]
};

const CLASSIFICATIONS = [
  'NÃO COMPARECEU',
  'COMPARECEU OPERADO',
  'COMPARECEU NÃO OPERADO',
  'LIMBO',
] as const;

interface FormData {
  _id?: string;
  name: string;
  sex: string;
  cpf: string;
  birthDate: string;
  age: string;
  phone: string;
  email: string;
  consultationDate: string;
  insuranceProvider: string;
  insuranceType: string;
  classification: string;
  profession: string;
  hospitals: string[];
  referral: string;
  observations: string;
  surgeryDate: string;
}

interface PatientFormProps {
  onClassificationChange?: (classification: string) => void;
  onSurgeryDateChange?: (date: string) => void;
  standalone?: boolean;
  readOnly?: boolean;
}

export function PatientForm({ 
  onClassificationChange, 
  onSurgeryDateChange, 
  standalone = true, 
  readOnly = false 
}: PatientFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    sex: '',
    cpf: '',
    birthDate: '',
    age: '',
    phone: '',
    email: '',
    consultationDate: '',
    insuranceProvider: '',
    insuranceType: '',
    classification: '',
    profession: '',
    hospitals: [],
    referral: '',
    observations: '',
    surgeryDate: ''
  });

  const [cpfStatus, setCpfStatus] = useState<{
    color: 'success' | 'warning' | 'error';
    message: string;
  }>({ color: 'warning', message: '' });

  const [emailStatus, setEmailStatus] = useState<{
    color: 'success' | 'warning' | 'error';
    message: string;
  }>({ color: 'warning', message: '' });

  const [isListening, setIsListening] = useState(false);

  const [recognition, setRecognition] = useState<any>(null);
  const [silenceTimer, setSilenceTimer] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const truncated = numbers.slice(0, 11);
    
    // Formata como (XX)XXXXXXXXX
    if (truncated.length >= 2) {
      return `(${truncated.slice(0, 2)})${truncated.slice(2)}`;
    }
    
    return truncated;
  };

  const validateEmail = (email: string): { isValid: boolean; message: string } => {
    if (!email) {
      return { isValid: true, message: '' }; // Email é opcional
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Email inválido' };
    }

    return { isValid: true, message: 'Email válido' };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const formattedCPF = formatCPF(value);
      const { isValid, isComplete } = validateCPF(formattedCPF);
      
      if (!isComplete) {
        setCpfStatus({ 
          color: 'warning',
          message: 'CPF incompleto'
        });
      } else if (!isValid) {
        setCpfStatus({ 
          color: 'error',
          message: 'CPF inválido'
        });
      } else {
        setCpfStatus({ 
          color: 'success',
          message: 'CPF válido'
        });
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: formattedCPF,
      }));
    } else if (name === 'email') {
      const { isValid, message } = validateEmail(value);
      setEmailStatus({
        color: isValid ? 'success' : 'error',
        message: message,
      });
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
    } else if (name === 'birthDate') {
      const age = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        age,
      }));
    } else if (name === 'consultationDate') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: value
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\./g, '')
        .toUpperCase(),
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    if (name === 'insuranceProvider') {
      if (value === 'Particular') {
        // Se for Particular, define o subtipo como Particular
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          insuranceType: 'Particular',
        }));
      } else {
        // Para outros convênios, limpa o tipo de plano
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          insuranceType: '', // Reset do tipo de plano
        }));
      }
    } else if (name === 'classification') {
      setFormData(prev => ({ ...prev, [name]: value }));
      onClassificationChange?.(value);
      
      // Se a classificação não for "compareceu operado", limpa a data de cirurgia
      if (value.toLowerCase() !== 'compareceu operado') {
        setFormData(prev => ({ ...prev, surgeryDate: '' }));
        onSurgeryDateChange?.('');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Mudança de data em ${name}:`, { original: value });
    
    const formattedDate = toDisplayDateFormat(value);
    console.log('Data formatada:', formattedDate);

    if (name === 'surgeryDate') {
      setFormData(prev => ({ ...prev, [name]: formattedDate }));
      onSurgeryDateChange?.(formattedDate);
    } else if (name === 'birthDate') {
      const age = calculateAge(formattedDate);
      setFormData(prev => ({
        ...prev,
        [name]: formattedDate,
        age,
      }));
    } else if (name === 'consultationDate') {
      setFormData(prev => ({ ...prev, [name]: formattedDate }));
    }
  };

  const handleHospitalChange = (hospital: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    
    // Se estiver marcando "Nenhum", desmarca todos os outros
    if (hospital === 'Nenhum' && checked) {
      setFormData(prev => ({
        ...prev,
        hospitals: ['Nenhum']
      }));
    }
    // Se estiver desmarcando "Nenhum" ou marcando outro hospital
    else {
      setFormData(prev => ({
        ...prev,
        hospitals: checked
          ? [...prev.hospitals.filter(h => h !== 'Nenhum'), hospital]
          : prev.hospitals.filter((h) => h !== hospital),
      }));
    }
  };

  const getInsuranceSubtypes = (provider: string) => {
    if (!provider) return [];
    if (provider === 'Particular') return ['Particular'];
    
    // Converte o nome do provedor para minúsculo, remove acentos e espaços
    const normalizedProvider = provider.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
    
    // Converte nomes específicos
    const providerMap: { [key: string]: string } = {
      'goldencross': 'goldencross',
      'portoseguro': 'portoseguro',
      'notredame': 'notredame'
    };
    
    const mappedProvider = providerMap[normalizedProvider] || normalizedProvider;
    return INSURANCE_SUBTYPES[mappedProvider] || [];
  };

  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
    }
    setIsListening(false);
    setRecognition(null);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const recognitionInstance = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      
      recognitionInstance.lang = 'pt-BR';
      recognitionInstance.continuous = false; // Mudado para false para parar após cada reconhecimento
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const dateTime = formatDateTime();
        const formattedText = `[${dateTime}] ${transcript}`;
        
        setFormData(prev => ({
          ...prev,
          observations: prev.observations ? `${prev.observations}\n${formattedText}` : formattedText
        }));

        // Inicia o timer de silêncio
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
        
        const newTimer = setTimeout(() => {
          stopListening(); // Para a gravação completamente após 2 segundos
        }, 2000);
        
        setSilenceTimer(newTimer);
      };

      recognitionInstance.onend = () => {
        // Se ainda estiver escutando e não for por causa do timer de silêncio
        if (isListening && !silenceTimer) {
          startListening(); // Reinicia a gravação
        } else {
          stopListening(); // Para completamente
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Erro no reconhecimento:', event.error);
        stopListening();
      };

      setRecognition(recognitionInstance);
      setIsListening(true);
      recognitionInstance.start();
    } else {
      alert('Seu navegador não suporta reconhecimento de voz.');
    }
  };

  // Limpa o timer e recognition quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement save logic
    navigate('/patients');
  };

  return (
    <Box>
      {standalone && (
        <Typography variant="h5" sx={{ mb: 3 }}>
          {id ? 'Editar Paciente' : 'Novo Paciente'}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Box sx={{ 
          p: 2, 
          backgroundColor: readOnly ? '#f5f5f5' : '#e8e8e8',  
          borderRadius: 1
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={1.0}>
              <TextField
                label="ID"
                value={"123456789012"}
                disabled
                sx={{ 
                  width: '100%',
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                onBlur={handleNameBlur}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} sm={0.98}>
              <FormControl fullWidth required>
                <InputLabel>Sexo</InputLabel>
                <Select
                  name="sex"
                  value={formData.sex}
                  label="Sexo"
                  onChange={handleSelectChange}
                  disabled={readOnly}
                >
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleTextChange}
                color={cpfStatus.color}
                helperText={cpfStatus.message}
                error={cpfStatus.color === 'error'}
                inputProps={{
                  maxLength: 14
                }}
                InputProps={{
                  endAdornment: cpfStatus.color === 'success' ? (
                    <InputAdornment position="end">
                      <CheckCircleIcon color="success" />
                    </InputAdornment>
                  ) : null
                }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                label="Indicação"
                name="referral"
                value={formData.referral}
                onChange={handleTextChange}
                placeholder="Quem indicou este paciente?"
                disabled={readOnly}
              />
            </Grid>

            {/* Segunda linha: Data de Nascimento, Telefone, Email */}
            <Grid item xs={12} sm={2}>
              <TextField
                required
                fullWidth
                type="date"
                label="Data de Nascimento"
                name="birthDate"
                value={formData.birthDate ? formData.birthDate.split('/').reverse().join('-') : ''}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                fullWidth
                label="Idade"
                value={formData.age}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                required
                fullWidth
                label="Celular"
                name="phone"
                value={formData.phone}
                onChange={handleTextChange}
                placeholder="(XX)XXXXXXXXX"
                inputProps={{
                  maxLength: 13
                }}
                sx={{ width: 'calc(100% - 64px)' }}
                disabled={readOnly}
              />
              <div style={{ 
                height: '56px', 
                display: 'flex', 
                alignItems: 'center'
              }}>
                <IconButton
                  color="success"
                  onClick={() => {
                    const phoneNumber = formData.phone.replace(/\D/g, '');
                    if (phoneNumber) {
                      window.open(`https://wa.me/55${phoneNumber}`, '_blank');
                    }
                  }}
                  sx={{
                    backgroundColor: '#25D366',
                    color: 'white',
                    borderRadius: '4px',
                    width: '56px',
                    height: '56px',
                    '&:hover': {
                      backgroundColor: '#128C7E'
                    }
                  }}
                  disabled={readOnly}
                >
                  <WhatsAppIcon sx={{ fontSize: '2rem' }} />
                </IconButton>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleTextChange}
                color={emailStatus.color}
                helperText={emailStatus.message}
                error={emailStatus.color === 'error'}
                sx={{
                  width: 'calc(100% - 64px)',
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    height: '23px',
                    padding: '16.5px 14px'
                  },
                  '& .MuiInputBase-root': {
                    height: '56px'
                  }
                }}
                InputProps={{
                  endAdornment: emailStatus.color === 'success' ? (
                    <InputAdornment position="end">
                      <CheckCircleIcon color="success" />
                    </InputAdornment>
                  ) : null
                }}
                disabled={readOnly}
              />
              <div style={{ 
                height: '56px', 
                display: 'flex', 
                alignItems: 'center'
              }}>
                <IconButton
                  onClick={() => {
                    if (formData.email) {
                      window.open(`mailto:${formData.email}`, '_blank');
                    }
                  }}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: '4px',
                    width: '56px',
                    height: '56px',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                  disabled={readOnly}
                >
                  <ForwardToInboxIcon sx={{ fontSize: '2rem' }} />
                </IconButton>
              </div>
            </Grid>

            {/* Terceira linha: Data da Consulta, Convênio, Tipo de Plano, Classificação e Profissão */}
            <Grid item xs={12} sm={2}>
              <TextField
                required
                fullWidth
                type="date"
                label="Data da Consulta"
                name="consultationDate"
                value={formData.consultationDate ? formData.consultationDate.split('/').reverse().join('-') : ''}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} sm={2.5}>
              <FormControl fullWidth required>
                <InputLabel>Convênio</InputLabel>
                <Select
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleSelectChange}
                  label="Convênio"
                  disabled={readOnly}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value="Particular">Particular</MenuItem>
                  <MenuItem value="Bradesco">Bradesco</MenuItem>
                  <MenuItem value="SulAmérica">SulAmérica</MenuItem>
                  <MenuItem value="Amil">Amil</MenuItem>
                  <MenuItem value="Cassi">Cassi</MenuItem>
                  <MenuItem value="Golden Cross">Golden Cross</MenuItem>
                  <MenuItem value="Mediservice">Mediservice</MenuItem>
                  <MenuItem value="Notre Dame">Notre Dame</MenuItem>
                  <MenuItem value="Petrobras">Petrobras</MenuItem>
                  <MenuItem value="Porto Seguro">Porto Seguro</MenuItem>
                  <MenuItem value="Unimed">Unimed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2.5}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Plano</InputLabel>
                <Select
                  name="insuranceType"
                  value={formData.insuranceType}
                  label="Tipo de Plano"
                  onChange={handleSelectChange}
                  disabled={!formData.insuranceProvider || readOnly}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {getInsuranceSubtypes(formData.insuranceProvider).map((subtype) => (
                    <MenuItem key={subtype} value={subtype}>
                      {subtype}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2.5}>
              <FormControl fullWidth required>
                <InputLabel>Classificação</InputLabel>
                <Select
                  name="classification"
                  value={formData.classification}
                  onChange={handleSelectChange}
                  label="Classificação"
                  disabled={readOnly}
                >
                  {CLASSIFICATIONS.map((classification) => (
                    <MenuItem key={classification} value={classification.toLowerCase()}>
                      {classification}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2.5}>
              <FormControl fullWidth required>
                <InputLabel>Profissão</InputLabel>
                <Select
                  name="profession"
                  value={formData.profession}
                  onChange={handleSelectChange}
                  label="Profissão"
                  disabled={readOnly}
                >
                  {PROFESSIONS.map((profession) => (
                    <MenuItem key={profession} value={profession}>
                      {profession}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Hospitais */}
            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend">Hospitais Possíveis</FormLabel>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormGroup sx={{ 
                    '& .MuiFormControlLabel-root': { margin: 0 },
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 0
                  }}>
                    {HOSPITALS_ROW1.map((hospital) => (
                      <FormControlLabel
                        key={hospital}
                        control={
                          <Checkbox
                            checked={formData.hospitals.includes(hospital)}
                            onChange={handleHospitalChange(hospital)}
                            name={hospital}
                            size="small"
                            disabled={hospital !== 'Nenhum' && formData.hospitals.includes('Nenhum') || readOnly}
                            sx={hospital === 'Nenhum' && formData.hospitals.includes(hospital) ? {
                              color: '#d32f2f',
                              '&.Mui-checked': {
                                color: '#d32f2f',
                              }
                            } : undefined}
                          />
                        }
                        label={hospital}
                        sx={{
                          width: isMobile ? '100%' : '20%',
                          '& .MuiTypography-root': {
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            ...(hospital === 'Nenhum' && formData.hospitals.includes(hospital) && {
                              color: '#d32f2f'
                            })
                          }
                        }}
                      />
                    ))}
                  </FormGroup>
                  <FormGroup sx={{ 
                    '& .MuiFormControlLabel-root': { margin: 0 },
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 0
                  }}>
                    {HOSPITALS_ROW2.map((hospital) => (
                      <FormControlLabel
                        key={hospital}
                        control={
                          <Checkbox
                            checked={formData.hospitals.includes(hospital)}
                            onChange={handleHospitalChange(hospital)}
                            name={hospital}
                            size="small"
                            disabled={hospital !== 'Nenhum' && formData.hospitals.includes('Nenhum') || readOnly}
                            sx={hospital === 'Nenhum' && formData.hospitals.includes(hospital) ? {
                              color: '#d32f2f',
                              '&.Mui-checked': {
                                color: '#d32f2f',
                              }
                            } : undefined}
                          />
                        }
                        label={hospital}
                        sx={{
                          width: isMobile ? '100%' : '20%',
                          '& .MuiTypography-root': {
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            ...(hospital === 'Nenhum' && formData.hospitals.includes(hospital) && {
                              color: '#d32f2f'
                            })
                          }
                        }}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="observations"
                value={formData.observations}
                onChange={handleTextChange}
                multiline
                rows={4}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={isListening ? stopListening : startListening}
                      sx={{
                        color: isListening ? 'error.main' : 'primary.main',
                        alignSelf: 'flex-start',
                        mt: 1
                      }}
                      disabled={readOnly}
                    >
                      {isListening ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }
                }}
                disabled={readOnly}
              />
            </Grid>

            {/* Botões */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/patients')}
                  disabled={readOnly}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={readOnly}>
                  Salvar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  );
}
