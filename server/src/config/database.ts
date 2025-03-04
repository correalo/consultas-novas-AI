import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prontuario-medico';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    } as mongoose.ConnectOptions;

    await mongoose.connect(mongoURI, options);
    
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB Connected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

    logger.info('MongoDB Connected Successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
