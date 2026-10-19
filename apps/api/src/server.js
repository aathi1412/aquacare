import { buildApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

const app = buildApp();

async function start() {
  try {
    // Attempt DB connection
    await connectDB(app.log);

    // Start server
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`AquaCare API Server running at http://${env.HOST}:${env.PORT}`);
    app.log.info(`Health check endpoint: http://${env.HOST}:${env.PORT}/api/v1/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown handling
const shutdown = async (signal) => {
  app.log.info(`Received ${signal}. Gracefully shutting down...`);
  try {
    await app.close();
    await disconnectDB();
    app.log.info('Server and database closed safely.');
    process.exit(0);
  } catch (err) {
    app.log.error(`Error during graceful shutdown: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
