import { isDbConnected } from '../../config/db.js';

export default async function healthRoutes(fastify) {
  fastify.get('/health', async (request, reply) => {
    const dbLive = isDbConnected();
    const mediaReady = Boolean(fastify.mediaService?.isConfigured);

    return reply.code(200).send({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        api: 'online',
        database: dbLive ? 'connected' : 'fallback_mode',
        mediaStorage: mediaReady ? 'cloudinary' : 'local_mock',
      },
      environment: process.env.NODE_ENV || 'development',
    });
  });
}
