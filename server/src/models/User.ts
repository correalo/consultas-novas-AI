import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe o email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Por favor, informe a senha'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'staff'],
    default: 'staff',
  },
}, {
  timestamps: true,
});

// Criptografa a senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
