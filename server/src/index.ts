import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { logger } from './utils/logger';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Configuração do CORS - em desenvolvimento, aceita qualquer origem
app.use(cors({
  origin: ['http://localhost:3003', 'http://www.localhost:3003'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middlewares
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Response logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const oldSend = res.send;
  res.send = function(data: any): Response {
    logger.info(`[${new Date().toISOString()}] Response for ${req.method} ${req.url}: ${JSON.stringify(data).substring(0, 200)}`);
    return oldSend.call(res, data);
  };
  next();
});

// Error logging middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`[${new Date().toISOString()}] Error: ${err.stack}`);
  next(err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Medical Records API', status: 'running' });
});

// Test route for database connection
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({
      status: 'ok',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      status: 'error',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack);
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Database URL: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/prontuario-medico'}`);
});
