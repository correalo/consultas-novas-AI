import mongoose from 'mongoose';

interface IFollowUp {
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

export interface IPatient extends mongoose.Document {
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
  surgeryDate: string;
  followUpData: Record<string, IFollowUp>;
  hospitals: string[];
  referral: string;
  observations: string;
}

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sex: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  birthDate: { type: String, required: true },
  age: { type: String },
  phone: { type: String },
  email: { type: String },
  consultationDate: { type: String, required: true },
  insuranceProvider: { type: String },
  insuranceType: { type: String },
  classification: { type: String },
  profession: { type: String },
  surgeryDate: { type: String },
  followUpData: { type: mongoose.Schema.Types.Mixed, default: {} },
  hospitals: [{ type: String }],
  referral: { type: String },
  observations: { type: String }
}, {
  timestamps: true
});

// Índices para melhorar a performance das consultas
patientSchema.index({ cpf: 1 });
patientSchema.index({ name: 1 });
patientSchema.index({ consultationDate: 1 });

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);
