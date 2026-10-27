import request from 'supertest';
import { app } from '../app';
import { TaskRepository } from '../models/task';

describe('Type-Safe Task Management REST API - Contract & Invariant Tests', () => {
  beforeEach(async () => {
    await TaskRepository.clear();
  });

  describe('POST /api/tasks - Task Creation & Validation Boundary', () => {
    it('creates a task with valid payload and returns 201 Created with strict schema', async () => {
      const payload = {
        title: 'Implement Type-Safe Endpoints',
        description: 'Enforce runtime validation using Zod in Express',
        priority: 'high',
        status: 'in-progress'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(payload.title);
      expect(response.body.data.priority).toBe(payload.priority);
      expect(response.body.data.status).toBe(payload.status);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('rejects empty or missing title with 400 Bad Request and validation issues', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '', priority: 'invalid-priority' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation Error');
      expect(Array.isArray(response.body.issues)).toBe(true);
      expect(response.body.issues.length).toBeGreaterThanOrEqual(1);
    });

    it('applies default priority and status when optional values are omitted', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task with Defaults' });

      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('medium');
      expect(response.body.data.status).toBe('pending');
    });
  });

  describe('GET /api/tasks & GET /api/tasks/:id', () => {
    it('retrieves all stored tasks', async () => {
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.length).toBe(2);
    });

    it('retrieves a single task by valid id', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'Target Task' });
      const taskId = created.body.data.id;

      const response = await request(app).get(`/api/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
      expect(response.body.data.title).toBe('Target Task');
    });

    it('returns 404 when querying a non-existent task id', async () => {
      const response = await request(app).get('/api/tasks/non-existent-uuid');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('PUT /api/tasks/:id - Update Task', () => {
    it('updates partial task fields and preserves unedited fields', async () => {
      const created = await request(app).post('/api/tasks').send({
        title: 'Original Title',
        priority: 'low'
      });
      const taskId = created.body.data.id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Original Title');
      expect(response.body.data.priority).toBe('low');
      expect(response.body.data.status).toBe('completed');
    });

    it('rejects invalid update values with 400 Bad Request', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'Original' });
      const taskId = created.body.data.id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ status: 'not-a-valid-status' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes an existing task and returns 200', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'To Delete' });
      const taskId = created.body.data.id;

      const deleteRes = await request(app).delete(`/api/tasks/${taskId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);

      const getRes = await request(app).get(`/api/tasks/${taskId}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 404 when deleting a non-existent task', async () => {
      const response = await request(app).delete('/api/tasks/unknown-id');
      expect(response.status).toBe(404);
    });
  });
});
