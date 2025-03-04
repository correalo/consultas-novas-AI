import { Request, Response } from 'express';
import { Patient } from '../models/Patient';
import { logger } from '../utils/logger';
import { dateUtils } from '../utils/dateUtils';

// Interface para parâmetros de paginação
interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const getPatients = async (req: Request, res: Response) => {
  try {
    logger.info('Buscando todos os pacientes');
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

    const patients = await Patient.find()
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    logger.info(`${patients.length} pacientes encontrados`);
    res.json(patients);
  } catch (error) {
    logger.error('Erro ao buscar pacientes:', error);
    res.status(500).json({ message: 'Erro ao buscar pacientes' });
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
  } catch (error) {
    logger.error('Erro ao buscar paciente por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar paciente' });
  }
};

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
  } catch (error) {
    logger.error('Erro ao criar paciente:', error);
    res.status(500).json({ message: 'Erro ao criar paciente' });
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
  } catch (error) {
    logger.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ message: 'Erro ao atualizar paciente' });
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
    res.status(204).send();
  } catch (error) {
    logger.error('Erro ao deletar paciente:', error);
    res.status(500).json({ message: 'Erro ao deletar paciente' });
  }
};
