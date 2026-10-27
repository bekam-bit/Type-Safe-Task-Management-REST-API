import { app } from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Healthcheck: http://localhost:${PORT}/health`);
  console.log(`API Endpoints: http://localhost:${PORT}/api/tasks`);
});
