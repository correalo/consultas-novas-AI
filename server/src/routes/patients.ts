import express from 'express';
import { body, query } from 'express-validator';
import * as patientController from '../controllers/patientController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Validação para paginação
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('order').optional().isIn(['asc', 'desc'])
];

// Validação para criação/atualização de paciente
const patientValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório')
    .isString().withMessage('Nome deve ser uma string')
    .trim(),
  
  body('sex').notEmpty().withMessage('Sexo é obrigatório')
    .isString().withMessage('Sexo deve ser uma string'),
  
  body('cpf').notEmpty().withMessage('CPF é obrigatório')
    .matches(/^\d{11}$/).withMessage('CPF deve conter 11 dígitos'),
  
  body('birthDate').notEmpty().withMessage('Data de nascimento é obrigatória')
    .isString().withMessage('Data de nascimento deve ser uma string'),
  
  body('age').notEmpty().withMessage('Idade é obrigatória')
    .isString().withMessage('Idade deve ser uma string'),
  
  body('phone').notEmpty().withMessage('Telefone é obrigatório')
    .matches(/^\d{10,11}$/).withMessage('Telefone deve ter entre 10 e 11 dígitos'),
  
  body('email').optional()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('consultationDate').notEmpty().withMessage('Data da consulta é obrigatória')
    .isString().withMessage('Data da consulta deve ser uma string'),
  
  body('insuranceProvider').notEmpty().withMessage('Convênio é obrigatório')
    .isString().withMessage('Convênio deve ser uma string'),
  
  body('insuranceType').notEmpty().withMessage('Tipo de plano é obrigatório')
    .isString().withMessage('Tipo de plano deve ser uma string'),
  
  body('classification').notEmpty().withMessage('Classificação é obrigatória')
    .isString().withMessage('Classificação deve ser uma string'),
  
  body('surgeryDate').optional()
    .isString().withMessage('Data da cirurgia deve ser uma string'),
  
  body('surgeryType').optional()
    .isString().withMessage('Tipo de cirurgia deve ser uma string'),
  
  body('followUpData').optional()
    .isObject().withMessage('Dados de acompanhamento devem ser um objeto'),
  
  body('hospitals').optional()
    .isArray().withMessage('Hospitais deve ser um array'),
  
  body('referral').optional()
    .isString().withMessage('Encaminhamento deve ser uma string'),
  
  body('observations').optional()
    .isString().withMessage('Observações deve ser uma string'),
];

// Rotas
router.post('/', patientValidation, validateRequest, patientController.createPatient);
router.get('/', paginationValidation, validateRequest, patientController.getPatients);
router.get('/:id', patientController.getPatient);
router.put('/:id', patientValidation, validateRequest, patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

export default router;
