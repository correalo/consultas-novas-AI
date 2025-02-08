import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { logger } from './utils/logger';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Medical Records API' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response) => {
  logger.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = 3002;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
