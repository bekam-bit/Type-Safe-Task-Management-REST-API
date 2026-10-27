import { Request, Response } from 'express';
import {
  TaskRepository,
  CreateTaskSchema,
  UpdateTaskSchema
} from '../models/task';

/**
 * Controller handling Type-Safe Task Management REST API Operations
 */
export class TaskController {
  /**
   * GET /api/tasks
   * Retrieves all tasks
   */
  static async getTasks(_req: Request, res: Response): Promise<Response> {
    try {
      const tasks = await TaskRepository.findAll();
      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error: Failed to retrieve tasks'
      });
    }
  }

  /**
   * GET /api/tasks/:id
   * Retrieves a single task by ID
   */
  static async getTaskById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const task = await TaskRepository.findById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: `Task with id '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error: Failed to retrieve task'
      });
    }
  }

  /**
   * POST /api/tasks
   * Validates runtime payload via Zod and creates a new task
   */
  static async createTask(req: Request, res: Response): Promise<Response> {
    try {
      // Step 2 & 4: Runtime Input Validation Guards
      const validationResult = CreateTaskSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: Invalid task payload',
          issues: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        });
      }

      const newTask = await TaskRepository.create(validationResult.data);
      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error: Failed to create task'
      });
    }
  }

  /**
   * PUT /api/tasks/:id
   * Validates partial updates and updates a task
   */
  static async updateTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Runtime validation for partial update
      const validationResult = UpdateTaskSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: Invalid update payload',
          issues: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        });
      }

      const updatedTask = await TaskRepository.update(id, validationResult.data);

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          error: `Task with id '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error: Failed to update task'
      });
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Deletes a task by ID
   */
  static async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await TaskRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: `Task with id '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        id
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error: Failed to delete task'
      });
    }
  }
}
