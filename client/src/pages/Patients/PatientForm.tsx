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
  IconButton
} from '@mui/material';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCPF, validateCPF } from '../../utils/cpfValidator';
import { useTheme, useMediaQuery } from '@mui/material';

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

const INSURANCE_PROVIDERS = [
  'ABET',
  'ALLIANZ',
  'AMAFRESP',
  'AMIL',
  'BRADESCO',
  'CABESP',
  'CARE PLUS',
  'CASSI',
  'CLASSES LABORIOSAS',
  'CUIDAR ME',
  'ECONOMUS',
  'EMBRATEL',
  'FUNDACAO CESP',
  'GAMA',
  'GEAP',
  'GOLDEN CROSS',
  'GREEN LINE',
  'INTERMÉDICA',
  'ITAU',
  'MARITIMA',
  'MEDIAL',
  'MEDISERVICE',
  'METRUS',
  'NOTRE DAME',
  'OMINT',
  'ONE HEALTH',
  'PARTICULAR',
  'PORTO SEGURO',
  'POSTAL SAUDE',
  'SABESP REV',
  'SAUDE CAIXA',
  'SOMPO SAÚDE',
  'SULAMERICA',
  'TRASMONTANO',
  'UNIMED',
  'UNIMED CENTRAL NACIONAL',
  'UNIMED FESP',
  'UNIMED GUARULHOS',
  'UNIMED SEGUROS',
  'VOLKSWAGEN',
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
    'AMIL SANTA PAULA',
    'AMIL S40',
    'AMIL S80',
    'AMIL S250',
    'AMIL S350',
    'AMIL S450',
    'AMIL S580',
    'AMIL S750'
  ],
  'default': [
    'ABSOLUTO',
    'ACESSO IV',
    'ADVANCE 600',
    'ADVANCE 700',
    'ADVANCE 800',
    'AGREGADO',
    'AMPLA COLETIVO',
    'ASSOCIADOS ATIVOS',
    'BASICO',
    'BASICO 10',
    'BETA',
    'BLUE III',
    'BLUE IV',
    'BLUE 300',
    'BLUE 300 PLUS',
    'BLUE 400',
    'BLUE 400 PLUS',
    'BLUE 500',
    'BLUE 500 PLUS',
    'BLUE 600',
    'BLUE 600 PLUS',
    'BLUE 700',
    'BLUE 800',
    'BLUE EXECUTIVO',
    'BRANCO',
    'BRANCO SL',
    'BRANCO 100',
    'BRANCO 150',
    'BRONZE',
    'BRONZE I',
    'BRONZE TOP',
    'CABESP FAMILIA',
    'CELEBRITY',
    'CENTRAL NACIONAL',
    'CLASS 620 E',
    'CLASS 620 A',
    'CLASS 640 A',
    'CLASSICO',
    'COMPLETO',
    'CORPORATIVO COMPLETO',
    'CORREIOS SAUDE',
    'CRISTAL I',
    'DIAMANTE I',
    'DIAMANTE I 876',
    'DINAMICO',
    'DSP CLINIC',
    'DSP PLENA',
    'DIX 10',
    'DIX ORIENTADOR',
    'DIX 100',
    'EFETIVO IV',
    'ELETROPAULO',
    'ESSENCIAL',
    'ESSENCIAL PLUS',
    'ESPECIAL',
    'ESPECIAL I',
    'ESPECIAL II',
    'ESPECIAL III',
    'ESPECIAL 100',
    'ESTILO I',
    'ESTILO III',
    'EXATO',
    'EXCELLENCE',
    'EXECUTIVE',
    'EXECUTIVO',
    'EXCLUSIVO',
    'FAMILIA',
    'FAMILA AGREGADO',
    'FESP',
    'FIT',
    'FLEX',
    'GREEN 211',
    'H2L2R2ED',
    'H3L2',
    'IDEAL ENFERMARIA',
    'INFINITY 1000',
    'INTEGRADA',
    'LIDER',
    'LIFE STD',
    'LT3',
    'LT4',
    'MASTER',
    'MASTER I',
    'MASTER II',
    'MASTER III',
    'MASTER IV',
    'MAX 250',
    'MAX 300',
    'MAX 350',
    'MAX 400',
    'MAXIMA',
    'MAXIMO',
    'MEDIAL 200',
    'MEDIAL CLASS 620',
    'MEDIAL 31',
    'MEDIAL 400',
    'MEDIAL 840 A',
    'MEDIAL ESTRELAS 31',
    'MEDIAL EXECUTIVE PLUS',
    'MEDIAL INTER II NAC PJCE',
    'MEDIAL GOL',
    'MEDIAL IDEAL 420 A',
    'MEDIAL ORIENTADOR CLASS 30',
    'MEDIAL PLENO II',
    'MEDIAL PREMIUM 840A',
    'MEDICUS M22',
    'MEDICUS 122',
    'MELHOR',
    'MS',
    'NDS 111',
    'NDS 126',
    'NDS 127',
    'NDS 130',
    'NDS 140',
    'NDS 141',
    'NDS 161',
    'ONE BLACK T2',
    'ONE BLACK T3',
    'ONE 2000',
    'OPCAO M22',
    'OPCAO 122',
    'ORIGINAL',
    'OSWALDO CRUZ 100',
    'OURO',
    'OURO I',
    'OURO III',
    'OURO IV',
    'OURO MAIS Q',
    'OURO MAX Q',
    'PADRAO',
    'PLENO',
    'PLENO II 920',
    'PLUS',
    'PME COMPACTO',
    'PORTO MED I',
    'PRATA',
    'PRATA BRONZE COPAR Q',
    'PRATA E MAIS',
    'PRATA MAIS Q',
    'PRATA I',
    'PRATA TOP',
    'PREMIUM',
    'PREMIUM TOP',
    'PREMIUM 800',
    'PREMIUM 900',
    'QUALITE',
    'REDE 300',
    'REFE EFETIVO',
    'REDE EFETIVO III',
    'REDE EFETIVO IV',
    'REDE HSC IDEAL',
    'REDE HSC NACIONAL',
    'REDE LIVRE ESCOLHA',
    'REDE PERFIL SP',
    'REDE PERSONAL IV',
    'REDE PREFERENCIAL',
    'REDE PREFERENCIAL PLUS',
    'REDE INTERNACIONAL',
    'REDE NACIONAL INDIVIDUAL',
    'REDE NACIONAL EMPRESARIAL',
    'REDE NACIONAL EMPRESARIAL SPG',
    'REDE NACIONAL ESPECIAL',
    'REDE NACIONAL FLEX',
    'REDE NACIONAL FLEX II',
    'REDE NACIONAL PLUS',
    'REDE PERSONAL VI',
    'REDE SCANIA',
    'REDE SIEMENS',
    'REGIONAL SAUDE CAIXA ATIVOS',
    'SELETO I',
    'SENIOR I',
    'SENIOR II 920',
    'SKILL',
    'SMART 200',
    'SMART 300',
    'SMART 400',
    'SMART 500',
    'SMART 600',
    'STANDARD',
    'SUPERIEUR',
    'SUPERIOR NACIONAL',
    'SUPREMO S750',
    'UNIPLAN INTEGRADA',
    'UNIPLAN PADRÃO',
    'UNIPLAN SUPREMO',
    'UNIPLAN UP OURO',
    'UNIPLAN UP BRONZE',
    'UNIPLAN',
    'UNIPLAN NEW PRATA',
    'VERSATIL',
    'VITA',
    'UNIPLAN ESPECIAL',
    'UNIPLAN MASTER',
    'AMIL'
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
  standalone?: boolean;
  readOnly?: boolean;
}

export function PatientForm({ onClassificationChange, standalone = true, readOnly = false }: PatientFormProps) {
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
    surgeryDate: '',
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

  const handleSelectChange = (e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'insuranceProvider') {
      // Limpa o tipo de plano quando muda o convênio
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        insuranceType: '', // Reset do tipo de plano
      }));
    } else if (name === 'classification') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      onClassificationChange?.(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
    const normalizedProvider = provider.toLowerCase();
    return INSURANCE_SUBTYPES[normalizedProvider] || INSURANCE_SUBTYPES['default'];
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
    setIsListening(false);
    if (recognition) {
      recognition.stop();
    }
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      
      // @ts-ignore
      const recognitionInstance = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      setRecognition(recognitionInstance);
      
      recognitionInstance.lang = 'pt-BR';
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const dateTime = formatDateTime();
        const formattedText = `[${dateTime}] ${transcript}`;
        
        setFormData(prev => ({
          ...prev,
          observations: prev.observations ? `${prev.observations}\n${formattedText}` : formattedText
        }));

        // Reinicia o timer quando há fala
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
        setSilenceTimer(setTimeout(() => {
          stopListening();
        }, 2000));
      };

      recognitionInstance.onerror = () => {
        stopListening();
      };

      recognitionInstance.onend = () => {
        stopListening();
      };

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

            {/* Segunda linha: Data de Nascimento, Telefone, Email e Data da Consulta */}
            <Grid item xs={12} sm={2}>
              <TextField
                required
                fullWidth
                type="date"
                label="Data de Nascimento"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleTextChange}
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
            <Grid item xs={12} sm={2.25}>
              <TextField
                required
                fullWidth
                type="datetime-local"
                label="Data da Consulta"
                name="consultationDate"
                value={formData.consultationDate}
                onChange={handleTextChange}
                InputLabelProps={{ shrink: true }}
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} sm={3.75} sx={{ display: 'flex', gap: 1 }}>
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

            {/* Terceira linha: Convênio, Tipo de Plano, Classificação */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Convênio</InputLabel>
                <Select
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleSelectChange}
                  label="Convênio"
                  disabled={readOnly}
                >
                  {INSURANCE_PROVIDERS.map((provider) => (
                    <MenuItem key={provider} value={provider.toLowerCase()}>
                      {provider}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Plano</InputLabel>
                <Select
                  name="insuranceType"
                  value={formData.insuranceType}
                  label="Tipo de Plano"
                  onChange={handleSelectChange}
                  disabled={!formData.insuranceProvider || readOnly}
                  MenuProps={{
                    style: { maxHeight: 300 }
                  }}
                >
                  {getInsuranceSubtypes(formData.insuranceProvider).map((subtype) => (
                    <MenuItem key={subtype} value={subtype}>
                      {subtype}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
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
                label="Observações"
                name="observations"
                value={formData.observations}
                onChange={handleTextChange}
                fullWidth
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
