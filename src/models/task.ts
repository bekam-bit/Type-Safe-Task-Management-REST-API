import { z } from 'zod';

/**
 * Task Priority Enum Schema
 */
export const TaskPriorityEnum = z.enum(['low', 'medium', 'high']);
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;

/**
 * Task Status Enum Schema
 */
export const TaskStatusEnum = z.enum(['pending', 'in-progress', 'completed']);
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

/**
 * Schema for creating a new Task
 */
export const CreateTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().default(''),
  priority: TaskPriorityEnum.default('medium'),
  status: TaskStatusEnum.default('pending')
});

/**
 * Schema for updating an existing Task
 */
export const UpdateTaskSchema = CreateTaskSchema.partial();

/**
 * Complete Task Entity Schema with system-managed metadata
 */
export const TaskSchema = CreateTaskSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;

/**
 * Thread-Safe In-Memory Repository Pattern
 */
export class TaskRepository {
  private static tasks: Map<string, Task> = new Map();

  /**
   * Returns all tasks in repository
   */
  static async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  /**
   * Retrieves a task by unique identifier
   */
  static async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  /**
   * Creates and stores a new Task entity
   */
  static async create(dto: CreateTaskDTO): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: dto.title.trim(),
      description: dto.description?.trim() || '',
      priority: dto.priority || 'medium',
      status: dto.status || 'pending',
      createdAt: now,
      updatedAt: now
    };
    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Updates an existing task with partial properties
   */
  static async update(id: string, dto: UpdateTaskDTO): Promise<Task | null> {
    const existing = this.tasks.get(id);
    if (!existing) return null;

    const updated: Task = {
      ...existing,
      ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
      ...(dto.description !== undefined ? { description: dto.description.trim() } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      updatedAt: new Date().toISOString()
    };

    this.tasks.set(id, updated);
    return updated;
  }

  /**
   * Deletes a task by ID
   */
  static async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  /**
   * Clears all tasks (useful for test teardown)
   */
  static async clear(): Promise<void> {
    this.tasks.clear();
  }
}
