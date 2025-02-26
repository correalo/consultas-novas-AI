export const formatDate = (value: string): string => {
  if (!value) return '';
  
  // Se já estiver no formato dd/mm/yyyy, retorna como está
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }
  
  // Se for uma data do input type="date" (yyyy-mm-dd)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
  
  return value;
};

export const convertDateToInputFormat = (value: string): string => {
  if (!value) return '';
  
  // Se já estiver no formato yyyy-mm-dd, retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  
  // Se estiver no formato dd/mm/yyyy, converte para yyyy-mm-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/');
    return `${year}-${month}-${day}`;
  }
  
  return value;
};

export const calculateAge = (birthDate: string): string => {
  if (!birthDate) return '';
  
  let dateParts: string[];
  
  // Verifica o formato da data
  if (birthDate.includes('/')) {
    dateParts = birthDate.split('/');
    // Converte dd/mm/yyyy para yyyy/mm/dd
    birthDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  } else if (birthDate.includes('-')) {
    dateParts = birthDate.split('-');
    // Converte yyyy-mm-dd para yyyy/mm/dd
    birthDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
  } else {
    return '';
  }
  
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age.toString();
};
