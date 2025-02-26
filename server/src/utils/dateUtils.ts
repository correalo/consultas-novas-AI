// Lista de feriados fixos (dd/mm)
const FIXED_HOLIDAYS = [
  '01/01', // Ano Novo
  '02/01', // Recesso Ano Novo
  '21/04', // Tiradentes
  '01/05', // Dia do Trabalho
  '07/09', // Independência
  '12/10', // Nossa Senhora
  '02/11', // Finados
  '15/11', // Proclamação da República
  '25/12', // Natal
  '26/12', // Recesso Natal
  '27/12', // Recesso Natal
  '28/12', // Recesso Natal
  '29/12', // Recesso Natal
  '30/12', // Recesso Natal
  '31/12', // Recesso Natal
];

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

// Função para verificar se um dia é válido (não é fim de semana nem feriado)
const isValidDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  // 0 = Domingo, 6 = Sábado
  return ![0, 6].includes(dayOfWeek) && !isHoliday(date);
};

// Função para obter o próximo dia válido
const getNextValidDay = (date: Date): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1); // Sempre avança pelo menos um dia
  
  while (!isValidDay(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  
  return nextDate;
};

// Função para obter o dia válido anterior
const getPreviousValidDay = (date: Date): Date => {
  const previousDate = new Date(date);
  previousDate.setDate(previousDate.getDate() - 1); // Sempre volta pelo menos um dia
  
  while (!isValidDay(previousDate)) {
    previousDate.setDate(previousDate.getDate() - 1);
  }
  
  return previousDate;
};

// Função para calcular a data de retorno
const calculateReturnDate = (surgeryDate: string, period: string): string => {
  if (!surgeryDate) return '';

  const [day, month, year] = surgeryDate.split('/').map(Number);
  if (!day || !month || !year) return '';

  const date = new Date(year, month - 1, day);
  const newDate = new Date(date);
  
  const numericValue = period.match(/\d+/)?.[0];
  if (!numericValue) return '';
  
  const value = parseInt(numericValue);

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

  // Encontra o próximo dia útil
  const validDate = getNextValidDay(newDate);

  // Formata a data de retorno
  const returnDay = validDate.getDate().toString().padStart(2, '0');
  const returnMonth = (validDate.getMonth() + 1).toString().padStart(2, '0');
  const returnYear = validDate.getFullYear();
  
  return `${returnDay}/${returnMonth}/${returnYear}`;
};

// Função para calcular a data do exame (10 dias antes do retorno)
const calculateExamDate = (returnDateStr: string): string => {
  if (!returnDateStr) return '';

  const [day, month, year] = returnDateStr.split('/').map(Number);
  if (!day || !month || !year) return '';

  const returnDate = new Date(year, month - 1, day);
  const examDate = new Date(returnDate);
  examDate.setDate(returnDate.getDate() - 10);

  // Encontra o dia útil anterior
  const validDate = getPreviousValidDay(examDate);

  // Formata a data como dd/mm/aaaa
  const examDay = validDate.getDate().toString().padStart(2, '0');
  const examMonth = (validDate.getMonth() + 1).toString().padStart(2, '0');
  const examYear = validDate.getFullYear();

  return `${examDay}/${examMonth}/${examYear}`;
};

export const dateUtils = {
  isHoliday,
  isValidDay,
  getNextValidDay,
  getPreviousValidDay,
  calculateReturnDate,
  calculateExamDate,
};
