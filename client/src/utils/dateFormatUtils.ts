// Converte data do formato dd/mm/yyyy para yyyy-mm-dd
export const toInputDateFormat = (date: string): string => {
  if (!date) return '';
  
  // Se já estiver no formato yyyy-mm-dd, retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Converte de dd/mm/yyyy para yyyy-mm-dd
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

// Converte data do formato yyyy-mm-dd para dd/mm/yyyy
export const toDisplayDateFormat = (date: string): string => {
  if (!date) return '';
  
  // Se já estiver no formato dd/mm/yyyy, retorna como está
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }
  
  // Converte de yyyy-mm-dd para dd/mm/yyyy
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

// Valida se a data está no formato dd/mm/yyyy
export const isValidDisplayFormat = (date: string): boolean => {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
};

// Valida se a data está no formato yyyy-mm-dd
export const isValidInputFormat = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};
