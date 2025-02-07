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
}

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome do paciente'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Por favor, informe a data de nascimento'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Por favor, informe o gênero'],
  },
  cpf: {
    type: String,
    required: [true, 'Por favor, informe o CPF'],
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
      required: [true, 'Por favor, informe a rua'],
    },
    number: {
      type: String,
      required: [true, 'Por favor, informe o número'],
    },
    complement: String,
    neighborhood: {
      type: String,
      required: [true, 'Por favor, informe o bairro'],
    },
    city: {
      type: String,
      required: [true, 'Por favor, informe a cidade'],
    },
    state: {
      type: String,
      required: [true, 'Por favor, informe o estado'],
    },
    zipCode: {
      type: String,
      required: [true, 'Por favor, informe o CEP'],
    },
  },
  phone: {
    type: String,
    required: [true, 'Por favor, informe o telefone'],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Por favor, informe o nome do contato de emergência'],
    },
    phone: {
      type: String,
      required: [true, 'Por favor, informe o telefone do contato de emergência'],
    },
    relationship: {
      type: String,
      required: [true, 'Por favor, informe o relacionamento do contato de emergência'],
    },
  },
  bloodType: String,
  allergies: [String],
  chronicConditions: [String],
  medications: [String],
}, {
  timestamps: true,
});

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);
