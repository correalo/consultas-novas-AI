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
export function toDisplayDateFormat(date: Date | string | undefined | null): string {
  if (!date) return '';
  
  if (date instanceof Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Se for string, verifica o formato
  if (typeof date === 'string') {
    // Se já estiver no formato dd/mm/yyyy
    if (date.includes('/')) {
      return date;
    }
    
    // Se estiver no formato ISO
    try {
      const [year, month, day] = date.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.warn('Data inválida:', date);
      return '';
    }
  }

  return '';
};

// Valida se a data está no formato dd/mm/yyyy
export const isValidDisplayFormat = (date: string): boolean => {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
};

// Valida se a data está no formato yyyy-mm-dd
export const isValidInputFormat = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};
