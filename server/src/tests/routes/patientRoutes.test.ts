import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Patient } from '../../models/Patient';
import { logger } from '../../utils/logger';

// Disable console logs during tests
logger.silent = true;

describe('Patient Routes', () => {
  // Sample patient data for testing
  const patientData = {
    name: 'Test Patient',
    sex: 'Masculino',
    cpf: '12345678901',
    birthDate: '1990-01-01',
    age: '33',
    phone: '11999999999',
    email: 'test@example.com',
    consultationDate: '2023-01-01',
    insuranceProvider: 'Test Insurance',
    insuranceType: 'Premium',
    classification: 'Urgent',
    profession: 'Engineer',
    observations: 'Test observations'
  };

  // Create a new patient with a unique CPF for each test
  const createUniquePatient = async (cpfSuffix: string) => {
    const uniquePatient = {
      ...patientData,
      cpf: `1234567${cpfSuffix}`, // Ensure unique CPF for each test
      name: `Test Patient ${cpfSuffix}`
    };
    
    const response = await request(app)
      .post('/api/patients')
      .send(uniquePatient);
      
    return response;
  };

  // Clean up after all tests
  afterAll(async () => {
    try {
      // Clean up test data
      await Patient.deleteMany({});
    } catch (error) {
      console.error('Error cleaning up test data:', error);
    }
  });

  // Test creating a patient
  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const uniquePatient = {
        ...patientData,
        cpf: '11111111111', // Unique CPF for this test
      };

      const response = await request(app)
        .post('/api/patients')
        .send(uniquePatient);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(uniquePatient.name);
      expect(response.body.cpf).toBe(uniquePatient.cpf);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteData = {
        name: 'Incomplete Patient'
      };

      const response = await request(app)
        .post('/api/patients')
        .send(incompleteData);

      expect(response.status).toBe(400);
    });
  });

  // Test getting all patients
  describe('GET /api/patients', () => {
    it('should return patients', async () => {
      // First create a patient to ensure there's data
      await createUniquePatient('8901');
      
      const response = await request(app)
        .get('/api/patients');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should support pagination', async () => {
      // Create two patients for pagination testing
      await createUniquePatient('8902');
      await createUniquePatient('8903');

      const response = await request(app)
        .get('/api/patients?page=1&limit=1');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeLessThanOrEqual(1); // Should respect the limit
    });
  });

  // Test getting a single patient
  describe('GET /api/patients/:id', () => {
    it('should return a patient by id', async () => {
      // First create a patient
      const createResponse = await createUniquePatient('8904');
      const patientId = createResponse.body._id;

      const response = await request(app)
        .get(`/api/patients/${patientId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', patientId);
    });

    it('should return 404 for non-existent patient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/api/patients/${nonExistentId}`);

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .get('/api/patients/invalid-id');

      expect(response.status).toBe(400);
    });
  });

  // Test updating a patient
  describe('PUT /api/patients/:id', () => {
    it('should update a patient', async () => {
      // First create a patient
      const createResponse = await createUniquePatient('8905');
      const patientId = createResponse.body._id;

      const updatedData = {
        ...patientData,
        cpf: createResponse.body.cpf, // Keep the same CPF
        name: 'Updated Patient Name',
        observations: 'Updated observations'
      };

      const response = await request(app)
        .put(`/api/patients/${patientId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.observations).toBe(updatedData.observations);
    });

    it('should return 404 for non-existent patient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .put(`/api/patients/${nonExistentId}`)
        .send(patientData);

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .put('/api/patients/invalid-id')
        .send(patientData);

      expect(response.status).toBe(400);
    });
  });

  // Test deleting a patient
  describe('DELETE /api/patients/:id', () => {
    it('should delete a patient', async () => {
      // First create a patient
      const createResponse = await createUniquePatient('8906');
      const patientId = createResponse.body._id;

      const response = await request(app)
        .delete(`/api/patients/${patientId}`);

      expect(response.status).toBe(204);

      // Verify patient was deleted
      const patient = await Patient.findById(patientId);
      expect(patient).toBeNull();
    });

    it('should return 404 for non-existent patient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .delete(`/api/patients/${nonExistentId}`);

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .delete('/api/patients/invalid-id');

      expect(response.status).toBe(400);
    });
  });
});
