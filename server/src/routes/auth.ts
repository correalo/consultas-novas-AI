import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  authController.login
);

router.post('/register',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('A senha deve ter no mínimo 6 caracteres'),
    body('role')
      .isIn(['admin', 'doctor', 'nurse', 'staff'])
      .withMessage('Função inválida'),
  ],
  authController.register
);

export default router;
