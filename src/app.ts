import express, { Application, Request, Response } from 'express';
import taskRoutes from './routes/taskRoutes';

export const app: Application = express();

// Middleware
app.use(express.json());

// Healthcheck & Metadata
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'Type-Safe-Task-Management-REST-API' });
});

// Mount Routes
app.use('/api', taskRoutes);

// 404 Fallback Route
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint Not Found' });
});
