import mongoose from 'mongoose';

export interface IMedicalRecord extends mongoose.Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  date: Date;
  type: 'consultation' | 'exam' | 'procedure';
  description: string;
  symptoms?: string[];
  diagnosis?: string[];
  prescriptions?: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  examRequests?: {
    examType: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
  }[];
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
  notes?: string;
}

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Por favor, informe o paciente'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Por favor, informe o médico'],
  },
  date: {
    type: Date,
    required: [true, 'Por favor, informe a data'],
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['consultation', 'exam', 'procedure'],
    required: [true, 'Por favor, informe o tipo de registro'],
  },
  description: {
    type: String,
    required: [true, 'Por favor, informe a descrição'],
  },
  symptoms: [String],
  diagnosis: [String],
  prescriptions: [{
    medication: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  }],
  examRequests: [{
    examType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  }],
  attachments: [{
    name: String,
    type: String,
    url: String,
  }],
  notes: String,
}, {
  timestamps: true,
});

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);
