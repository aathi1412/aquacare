import { login, logout, getMe } from './auth.controller.js';

export default async function authRoutes(fastify) {
  // Public login
  fastify.post('/login', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
  }, login);

  // Public logout
  fastify.post('/logout', logout);

  // Protected current user
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
  }, getMe);
}
