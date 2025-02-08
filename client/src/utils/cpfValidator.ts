export const formatCPF = (cpf: string): string => {
  return cpf
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const validateCPF = (cpf: string): { isValid: boolean; isComplete: boolean } => {
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se está completo
  if (cleanCPF.length !== 11) {
    return { isValid: false, isComplete: false };
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) {
    return { isValid: false, isComplete: true };
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) {
    return { isValid: false, isComplete: true };
  }

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) {
    return { isValid: false, isComplete: true };
  }

  return { isValid: true, isComplete: true };
};
