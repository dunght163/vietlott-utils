import { createApp } from './app.js';
import { env } from './config/env.js';
import { sequelize, testConnection } from './config/database.js';

async function bootstrap(): Promise<void> {
  const dbOk = await testConnection();
  if (!dbOk) {
    console.warn('Starting server despite failed initial DB connection. Health endpoint will report degraded.');
  } else {
    console.log('Connected to database.');
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT} (env=${env.NODE_ENV})`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received, shutting down...`);
    server.close(() => console.log('HTTP server closed.'));
    try {
      await sequelize.close();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing database:', err);
    }
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void bootstrap();
