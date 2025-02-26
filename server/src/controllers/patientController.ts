import { Request, Response } from 'express';
import { Patient } from '../models/Patient';
import { logger } from '../utils/logger';
import { dateUtils } from '../utils/dateUtils';

// Tipo para erros do Mongoose
interface MongooseError extends Error {
  message: string;
  code?: number;
}

// Interface para parâmetros de paginação
interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const createPatient = async (req: Request, res: Response) => {
  try {
    // Validação básica dos campos obrigatórios
    const { name, birthDate, cpf, surgeryDate, followUpData } = req.body;
    if (!name || !birthDate || !cpf) {
      return res.status(400).json({ 
        message: 'Nome, data de nascimento e CPF são campos obrigatórios' 
      });
    }

    // Se houver data de cirurgia e dados de acompanhamento, recalcula as datas
    if (surgeryDate && followUpData) {
      Object.keys(followUpData).forEach(period => {
        if (followUpData[period]) {
          const returnDate = dateUtils.calculateReturnDate(surgeryDate, period);
          followUpData[period].returns = returnDate;
          followUpData[period].exams = dateUtils.calculateExamDate(returnDate);
        }
      });
    }

    const patient = new Patient(req.body);
    await patient.save();
    
    logger.info(`Novo paciente criado: ${patient._id}`);
    res.status(201).json(patient);
  } catch (error: unknown) {
    const err = error as MongooseError;
    logger.error(`Erro ao criar paciente: ${err.message}`);
    
    // Tratamento específico para erro de duplicação
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Já existe um paciente com este CPF' 
      });
    }
    
    res.status(400).json({ message: err.message });
  }
};

export const getPatients = async (req: Request, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10',
      sortBy = 'name',
      order = 'asc'
    } = req.query as PaginationQuery;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Construir query de ordenação
    const sortQuery: { [key: string]: 1 | -1 } = { [sortBy]: order === 'desc' ? -1 : 1 };

    // Executar queries em paralelo para melhor performance
    const [patients, total] = await Promise.all([
      Patient.find()
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Patient.countDocuments()
    ]);

    res.json({
      patients,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalItems: total
    });
  } catch (error: unknown) {
    const err = error as MongooseError;
    logger.error(`Erro ao listar pacientes: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const getPatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }
    res.json(patient);
  } catch (error: unknown) {
    const err = error as MongooseError;
    logger.error(`Erro ao buscar paciente: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { surgeryDate, followUpData } = req.body;

    // Validar ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // Se houver data de cirurgia e dados de acompanhamento, recalcula as datas
    if (surgeryDate && followUpData) {
      logger.info(`Recalculando datas para paciente ${id}`, { surgeryDate });
      
      Object.keys(followUpData).forEach(period => {
        if (followUpData[period] && followUpData[period].enabled) {
          const returnDate = dateUtils.calculateReturnDate(surgeryDate, period);
          if (returnDate) {
            followUpData[period].returns = returnDate;
            followUpData[period].exams = dateUtils.calculateExamDate(returnDate);
            logger.info(`Período ${period}:`, {
              returnDate,
              examDate: followUpData[period].exams
            });
          }
        }
      });
    }

    const patient = await Patient.findByIdAndUpdate(
      id,
      { ...req.body, followUpData },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    logger.info(`Paciente atualizado: ${id}`);
    res.json(patient);
  } catch (error: unknown) {
    const err = error as MongooseError;
    logger.error(`Erro ao atualizar paciente: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    logger.info(`Paciente deletado: ${id}`);
    res.json({ message: 'Paciente removido com sucesso' });
  } catch (error: unknown) {
    const err = error as MongooseError;
    logger.error(`Erro ao deletar paciente: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};
