import express from 'express';
import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController';

const router = express.Router();

// Rotas públicas (temporariamente para teste)
router.get('/', getPatients);
router.get('/:id', getPatient);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export { router as patientRoutes };
