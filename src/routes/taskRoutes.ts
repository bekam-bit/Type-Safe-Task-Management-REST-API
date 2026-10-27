import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

/**
 * Task Management Endpoints Mapping
 * GET    /api/tasks     - Retrieve all tasks
 * GET    /api/tasks/:id - Retrieve task by id
 * POST   /api/tasks     - Create new task with Zod validation
 * PUT    /api/tasks/:id - Update task with partial validation
 * DELETE /api/tasks/:id - Delete task by id
 */
router.get('/tasks', TaskController.getTasks);
router.get('/tasks/:id', TaskController.getTaskById);
router.post('/tasks', TaskController.createTask);
router.put('/tasks/:id', TaskController.updateTask);
router.delete('/tasks/:id', TaskController.deleteTask);

export default router;
