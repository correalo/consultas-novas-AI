export type Period = '7 dias' | '30 dias' | '90 dias' | '3 meses' | '6 meses' | '9 meses' | '12 meses' | '15 meses' | '18 meses' | '2 anos' | '3 anos' | '4 anos' | '5 anos' | '6 anos' | '7 anos' | '8 anos' | '9 anos' | '10 anos' | '11 anos' | '12 anos' | '13 anos' | '14 anos' | '15 anos';

export interface FollowUpData {
  exams?: string;
  returns?: string;
  attendance?: 'sim' | 'nao';
  forwardExams?: boolean;
  contact1?: boolean;
  contact2?: boolean;
  contact3?: boolean;
  contact4?: boolean;
  contact5?: boolean;
}
