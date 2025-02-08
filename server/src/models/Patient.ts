import mongoose from 'mongoose';

export interface IPatient extends mongoose.Document {
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  cpf: string;
  rg?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  email?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  consultationDate: Date;
  insuranceProvider: string;
  insuranceType: string;
  classification: string;
  surgeryDate?: Date;
  observations?: string;
  referral?: string;
  hospitals?: string[];
}

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, insira o nome do paciente'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Por favor, insira a data de nascimento'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Por favor, selecione o gênero'],
  },
  cpf: {
    type: String,
    required: [true, 'Por favor, insira o CPF'],
    unique: true,
    trim: true,
  },
  rg: {
    type: String,
    trim: true,
  },
  address: {
    street: {
      type: String,
      required: [true, 'Por favor, insira a rua'],
    },
    number: {
      type: String,
      required: [true, 'Por favor, insira o número'],
    },
    complement: String,
    neighborhood: {
      type: String,
      required: [true, 'Por favor, insira o bairro'],
    },
    city: {
      type: String,
      required: [true, 'Por favor, insira a cidade'],
    },
    state: {
      type: String,
      required: [true, 'Por favor, insira o estado'],
    },
    zipCode: {
      type: String,
      required: [true, 'Por favor, insira o CEP'],
    },
  },
  phone: {
    type: String,
    required: [true, 'Por favor, insira o telefone'],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Por favor, insira o nome do contato de emergência'],
    },
    phone: {
      type: String,
      required: [true, 'Por favor, insira o telefone do contato de emergência'],
    },
    relationship: {
      type: String,
      required: [true, 'Por favor, insira o relacionamento do contato de emergência'],
    },
  },
  bloodType: String,
  allergies: [String],
  chronicConditions: [String],
  medications: [String],
  consultationDate: {
    type: Date,
    required: [true, 'Por favor, insira a data da consulta'],
  },
  insuranceProvider: {
    type: String,
    required: [true, 'Por favor, selecione o convênio'],
  },
  insuranceType: {
    type: String,
    required: [true, 'Por favor, insira o tipo de plano'],
  },
  classification: {
    type: String,
    required: [true, 'Por favor, selecione a classificação'],
  },
  surgeryDate: {
    type: Date,
  },
  observations: {
    type: String,
  },
  referral: {
    type: String,
  },
  hospitals: {
    type: [String],
    enum: ['HAOC', 'H. Santa Catarina', 'Lefort Liberdade', 'Lefort Morumbi', 'HCor', 'HIAE', 'HSL', 'H. Santa Paula', 'IGESP'],
  },
}, {
  timestamps: true,
});

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);
