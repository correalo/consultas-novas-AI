import mongoose from 'mongoose';

interface IFollowUp {
  exams?: string;
  returns?: string;
  attendance?: 'sim' | 'nao';
  forwardExams?: boolean;
  contact1?: boolean;
  contact2?: boolean;
  contact3?: boolean;
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
  surgeryDate: string;
  surgeryType: string;
  followUpData: Record<string, IFollowUp>;
  hospitals: string[];
  referral: string;
  observations: string;
}

const followUpSchema = new mongoose.Schema({
  exams: String,
  returns: String,
  attendance: {
    type: String,
    enum: ['sim', 'nao'],
  },
  forwardExams: Boolean,
  contact1: Boolean,
  contact2: Boolean,
  contact3: Boolean,
});

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sex: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  consultationDate: {
    type: String,
    required: true,
  },
  insuranceProvider: {
    type: String,
    required: true,
  },
  insuranceType: {
    type: String,
    required: true,
  },
  classification: {
    type: String,
    required: true,
  },
  surgeryDate: {
    type: String,
  },
  surgeryType: {
    type: String,
  },
  followUpData: {
    type: Map,
    of: followUpSchema,
    default: {},
  },
  hospitals: [{
    type: String,
  }],
  referral: {
    type: String,
  },
  observations: {
    type: String,
  },
}, {
  timestamps: true,
});

// Índices para melhorar a performance das consultas
patientSchema.index({ cpf: 1 }, { unique: true });
patientSchema.index({ name: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ insuranceProvider: 1 });

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);
